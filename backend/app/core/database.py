import logging
from typing import Dict, Any, List, Optional
from pymongo import ASCENDING, DESCENDING
import motor.motor_asyncio
from app.core.config import settings

logger = logging.getLogger("chakravyuh.db")


def _doc_matches(doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
    """Evaluates whether a document satisfies a MongoDB query filter."""
    for k, v in query.items():
        if k == "$or" and isinstance(v, list):
            if not any(_doc_matches(doc, subq) for subq in v):
                return False
            continue

        doc_val = doc.get(k)
        if isinstance(v, dict):
            if "$in" in v:
                allowed = v["$in"]
                if isinstance(doc_val, list):
                    if not any(item in allowed for item in doc_val):
                        return False
                else:
                    if doc_val not in allowed:
                        return False
            continue

        if isinstance(doc_val, list):
            if v not in doc_val:
                return False
        else:
            if doc_val != v:
                return False

    return True


class InMemoryCollection:
    """In-memory fallback collection for resilient offline/tactical operation."""

    def __init__(self, name: str):
        self.name = name
        self.documents: List[Dict[str, Any]] = []

    async def insert_one(self, doc: Dict[str, Any]):
        self.documents.append(doc)
        return type(
            "InsertResult", (), {"inserted_id": doc.get("_id", doc.get("id"))}
        )()

    async def insert_many(self, docs: List[Dict[str, Any]]):
        self.documents.extend(docs)
        return type(
            "InsertResult",
            (),
            {"inserted_ids": [d.get("_id", d.get("id")) for d in docs]},
        )()

    async def find_one(self, query: Dict[str, Any]):
        for doc in self.documents:
            if _doc_matches(doc, query):
                return doc
        return None

    def find(
        self, query: Optional[Dict[str, Any]] = None, sort: Optional[List[tuple]] = None
    ):
        docs = self.documents
        if query:
            docs = [d for d in docs if _doc_matches(d, query)]

        class AsyncCursor:
            def __init__(self, items: List[Dict[str, Any]]):
                self.items = list(items)

            def sort(self, key_or_list, direction=None):
                if isinstance(key_or_list, list) and len(key_or_list) > 0:
                    field, order = key_or_list[0]
                    self.items.sort(
                        key=lambda x: str(x.get(field, "")),
                        reverse=(order == -1 or order == DESCENDING),
                    )
                elif isinstance(key_or_list, str):
                    self.items.sort(
                        key=lambda x: str(x.get(key_or_list, "")),
                        reverse=(direction == -1 or direction == DESCENDING),
                    )
                return self

            def skip(self, n: int):
                self.items = self.items[n:]
                return self

            def limit(self, n: int):
                self.items = self.items[:n]
                return self

            async def to_list(self, length: Optional[int] = None):
                if length is not None:
                    return self.items[:length]
                return self.items

            def __aiter__(self):
                self._iter = iter(self.items)
                return self

            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration

        return AsyncCursor(docs)

    async def count_documents(self, query: Dict[str, Any]) -> int:
        c = 0
        for doc in self.documents:
            if _doc_matches(doc, query):
                c += 1
        return c

    async def delete_many(self, query: Dict[str, Any]):
        if not query:
            self.documents.clear()
        else:
            self.documents = [d for d in self.documents if not _doc_matches(d, query)]

    async def create_index(self, *args, **kwargs):
        pass


class DatabaseManager:
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db = None
        self.is_connected = False
        self._offline_detected = False
        self._in_memory_collections: Dict[str, InMemoryCollection] = {}

    async def connect(self):
        if self._offline_detected:
            return

        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URI, serverSelectionTimeoutMS=250
            )
            # Verify connectivity
            await self.client.admin.command("ping")
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info(
                "Connected to MongoDB at %s (DB: %s)",
                settings.MONGODB_URI,
                settings.DATABASE_NAME,
            )
            await self.init_indexes()
        except Exception as e:
            self.is_connected = False
            self._offline_detected = True
            logger.warning("MongoDB offline (%s). Using tactical in-memory store.", e)

    async def disconnect(self):
        if self.client:
            self.client.close()
            self.is_connected = False

    def get_collection(self, name: str):
        if self.is_connected and self.db is not None:
            return self.db[name]
        if name not in self._in_memory_collections:
            self._in_memory_collections[name] = InMemoryCollection(name)
        return self._in_memory_collections[name]

    async def init_indexes(self):
        if not self.is_connected or self.db is None:
            return
        try:
            # syndicate_graph
            await self.db.syndicate_nodes.create_index([("id", ASCENDING)], unique=True)
            await self.db.syndicate_nodes.create_index([("type", ASCENDING)])
            await self.db.syndicate_edges.create_index(
                [("source", ASCENDING), ("target", ASCENDING)]
            )

            # intelligence_logs
            await self.db.intelligence_logs.create_index([("case_id", ASCENDING)])
            await self.db.intelligence_logs.create_index([("source_type", ASCENDING)])
            await self.db.intelligence_logs.create_index([("timestamp", DESCENDING)])

            # evidence_records
            await self.db.evidence_records.create_index(
                [("evidence_id", ASCENDING)], unique=True
            )
            await self.db.evidence_records.create_index([("case_id", ASCENDING)])

            # audit_logs
            await self.db.audit_logs.create_index([("timestamp", DESCENDING)])
            await self.db.audit_logs.create_index([("user_id", ASCENDING)])
            await self.db.audit_logs.create_index([("endpoint", ASCENDING)])

            # cases
            await self.db.cases.create_index([("case_id", ASCENDING)], unique=True)
            await self.db.cases.create_index([("assigned_io_ids", ASCENDING)])
            logger.info("MongoDB indexes verified.")
        except Exception as err:
            logger.warning("Index creation error: %s", err)


db_manager = DatabaseManager()


def get_db():
    return db_manager

from typing import List, Dict, Any, Optional
from app.core.database import db_manager
from app.models.common import AuthenticatedUser, UserRole
from app.models.case import InvestigationCase


class CaseService:
    @staticmethod
    async def get_cases_for_user(user: AuthenticatedUser) -> List[Dict[str, Any]]:
        coll = db_manager.get_collection("cases")

        # If Admin or Super Admin, return all cases
        if user.role in (UserRole.SUPER_ADMIN, UserRole.ADMIN):
            cursor = coll.find({})
            cases = await cursor.to_list(length=100)
        else:
            # Analyst/IO only gets cases assigned to them
            cursor = coll.find(
                {
                    "$or": [
                        {"assigned_io_ids": user.user_id},
                        {"lead_investigator_id": user.user_id},
                    ]
                }
            )
            cases = await cursor.to_list(length=100)

        cleaned = []
        for c in cases:
            if "_id" in c:
                c["_id"] = str(c["_id"])
            cleaned.append(c)

        return cleaned

    @staticmethod
    async def check_case_access(user: AuthenticatedUser, case_id: str) -> bool:
        # Super Admin & Admin have access to all cases
        if user.role in (UserRole.SUPER_ADMIN, UserRole.ADMIN):
            return True

        coll = db_manager.get_collection("cases")
        case = await coll.find_one(
            {
                "case_id": case_id,
                "$or": [
                    {"assigned_io_ids": user.user_id},
                    {"lead_investigator_id": user.user_id},
                ],
            }
        )
        return case is not None

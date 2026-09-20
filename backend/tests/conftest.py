import pytest
import asyncio
from fastapi.testclient import TestClient
from main import app
from app.seed.demo_seed import seed_database


@pytest.fixture(scope="session", autouse=True)
def initialize_database():
    """Seed database once for test session."""
    asyncio.run(seed_database())


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

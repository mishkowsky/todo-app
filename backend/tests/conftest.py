import os

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def env_vars():
    os.environ["DB_URI"] = "sqlite:///./test.db"


@pytest.fixture(scope="module")
def test_db(env_vars):
    from src.database import Base
    engine = create_engine("sqlite:///./test.db")
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    yield TestingSessionLocal()

    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def client(test_db):
    from src.main import get_db, app, engine
    app.dependency_overrides[get_db] = lambda: test_db
    app.dependency_overrides[engine] = create_engine("sqlite:///./test.db")
    yield TestClient(app)

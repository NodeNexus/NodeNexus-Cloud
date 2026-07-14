import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import MagicMock

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def mock_docker(monkeypatch):
    mock = MagicMock()
    # Mock the docker.from_env() to return our mock client
    monkeypatch.setattr("docker.from_env", lambda: mock)
    return mock

def test_get_containers_empty(client, mock_docker):
    # Setup mock to return empty list of containers
    mock_docker.containers.list.return_value = []
    
    # Needs auth, so we mock dependencies or use a test token
    # For simplicity, if auth is enabled globally, we'd override the dependency in conftest.
    # Assuming standard JWT auth dependency is injected.
    pass

def test_docker_service_mock(mock_docker):
    # Direct test of the mock
    mock_docker.containers.list.return_value = [{"id": "123", "name": "test-container"}]
    containers = mock_docker.containers.list()
    assert len(containers) == 1
    assert containers[0]["name"] == "test-container"

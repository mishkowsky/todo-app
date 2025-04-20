def test_create_task(client):
    response = client.post("/api/tasks", json={"title": "Test task", "description": "Test description", "completed": "False"})
    assert response.status_code == 200
    assert response.json()["title"] == "Test task"
    assert response.json()["description"] == "Test description"
    return response.json()["id"]


def test_read_tasks(client):
    response = client.get("/api/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Ensure the response is a list


def test_read_task(client):
    task_id = test_create_task(client)  # Create a task_list_item to read it
    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id


def test_read_nonexistent_task(client):
    response = client.get("/api/tasks/999")  # Assuming 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}


def test_update_task(client):
    task_id = test_create_task(client)  # Create a task_list_item to update it
    response = client.put(f"/api/tasks/{task_id}",
                          json={"title": "Updated task", "description": "Updated description", "is_done": "False"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated task"
    assert response.json()["description"] == "Updated description"


def test_update_nonexistent_task(client):
    response = client.put("/api/tasks/999",
                          json={"title": "Nonexistent task", "description": "Should fail", "is_done": "True"})
    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}


def test_delete_task(client):
    task_id = test_create_task(client)  # Create a task_list_item to delete it
    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id


def test_delete_nonexistent_task(client):
    response = client.delete("/api/tasks/999")  # Assuming 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}


def test_read_tasks_after_deletion(client):
    task_id = test_create_task(client)  # Create a task_list_item to delete it
    client.delete(f"/api/tasks/{task_id}")  # Delete the created task_list_item
    response = client.get("/api/tasks/")
    assert response.status_code == 200
    tasks = response.json()
    assert all(task["id"] != task_id for task in tasks)  # Ensure the deleted task_list_item is not in the list

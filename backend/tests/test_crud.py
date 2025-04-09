def test_create_todo(client):
    response = client.post("/todo/", json={"title": "Test Todo", "description": "Test description", "is_done": "False"})
    assert response.status_code == 200
    assert response.json()["title"] == "Test Todo"
    assert response.json()["description"] == "Test description"
    return response.json()["id"]


def test_read_todos(client):
    response = client.get("/todo/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Ensure the response is a list


def test_read_todo(client):
    todo_id = test_create_todo(client)  # Create a todo_list_item to read it
    response = client.get(f"/todo/{todo_id}")
    assert response.status_code == 200
    assert response.json()["id"] == todo_id


def test_read_nonexistent_todo(client):
    response = client.get("/todo/999")  # Assuming 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Todo not found"}


def test_update_todo(client):
    todo_id = test_create_todo(client)  # Create a todo_list_item to update it
    response = client.put(f"/todo/{todo_id}",
                          json={"title": "Updated Todo", "description": "Updated description", "is_done": "False"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Todo"
    assert response.json()["description"] == "Updated description"


def test_update_nonexistent_todo(client):
    response = client.put("/todo/999",
                          json={"title": "Nonexistent Todo", "description": "Should fail", "is_done": "True"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Todo not found"}


def test_delete_todo(client):
    todo_id = test_create_todo(client)  # Create a todo_list_item to delete it
    response = client.delete(f"/todo/{todo_id}")
    assert response.status_code == 200
    assert response.json()["id"] == todo_id


def test_delete_nonexistent_todo(client):
    response = client.delete("/todo/999")  # Assuming 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Todo not found"}


def test_read_todos_after_deletion(client):
    todo_id = test_create_todo(client)  # Create a todo_list_item to delete it
    client.delete(f"/todo/{todo_id}")  # Delete the created todo_list_item
    response = client.get("/todo/")
    assert response.status_code == 200
    todos = response.json()
    assert all(todo["id"] != todo_id for todo in todos)  # Ensure the deleted todo_list_item is not in the list

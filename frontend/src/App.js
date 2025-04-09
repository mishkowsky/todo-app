import React, {useState, useEffect} from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const TodoItem = ({todo, onDelete, onEdit}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title); // Text for title
    const [newDescription, setNewDescription] = useState(todo.description); // Description
    const [newIsDone, setNewIsDone] = useState(todo.is_done);

    const handleSave = () => {
        if (newTitle.trim() && newDescription.trim()) {
            onEdit(todo.id, newTitle, newDescription, newIsDone); // Pass new title and description to parent
            setIsEditing(false); // Exit edit mode
        } else {
            alert("Title and description can't be empty");
        }
    };

    return (
        <div>
            <input
                type="checkbox"
                checked={newIsDone}
                onChange={(e) => setNewIsDone(e.target.checked)}
            />
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <textarea
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                </div>
            ) : (
                <div>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                </div>
            )}
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && <button onClick={handleSave}>Save</button>}
            <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
    );
};

const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        axios.get('/todo')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the todos!', error);
            });
    }, []);

    const handleAddTodo = () => {
        if (newTodo.trim() && newDescription.trim()) {
            const todo = {title: newTodo, description: newDescription, is_done: false};
            axios.post('/todo', todo)
                .then(response => {
                    setTodos([...todos, response.data]);
                    setNewTodo('');
                    setNewDescription('');
                })
                .catch(error => {
                    console.error('There was an error adding the todo!', error);
                });
        } else {
            alert("Title and description can't be empty");
        }
    };

    const handleDeleteTodo = (id) => {
        axios.delete(`/todo/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the todo!', error);
            });
    };

    const handleEditTodo = (id, newTitle, newDescription, newIsDine) => {
        axios.put(`/todo/${id}`, {title: newTitle, description: newDescription, is_done: newIsDine})
            .then(response => {
                setTodos(todos.map(t => (t.id === id ? response.data : t)));
            })
            .catch(error => {
                console.error('There was an error updating the todo!', error);
            });
    };

    return (
        <div>
            <h1>Todo List</h1>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task title"
            />
            <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add a description"
            />
            <button onClick={handleAddTodo}>Add</button>
            <div>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onDelete={handleDeleteTodo}
                        onToggleComplete={handleEditTodo}
                        onEdit={handleEditTodo}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;

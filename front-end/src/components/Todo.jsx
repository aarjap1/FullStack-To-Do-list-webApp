import React, { useState, useEffect } from "react";
import "../css/Todo.css";
import todologo from "../images/logo.png";
const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const backendUrl = "http://localhost:8000/api/todos";

  useEffect(() => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      });
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo = { text: newTodo };
      fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos([...todos, data]);
        })
        .catch((error) => console.error("Error adding todo:", error));
      setNewTodo("");
    }
  };

  const updateTodo = (id) => {
    const updatedTodo = { text: editText };
    fetch(`${backendUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? data : todo
        );
        setTodos(updatedTodos);
        setEditId(null);
        setEditText("");
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const deleteTodo = (id) => {
    fetch(`${backendUrl}/${id}`, { method: "DELETE" })
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <>
      <div className="todo-container">
        <img src={todologo} alt="main-logo" className="logo" />
        <h1>Todo List</h1>
        <div>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo"
            onKeyPress={handleKeyPress}
          />
          <button onClick={addTodo}>Add</button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {editId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="edit" onClick={() => updateTodo(todo.id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  {todo.text}
                  <div>
                    <button
                      className="edit"
                      onClick={() => {
                        setEditId(todo.id);
                        setEditText(todo.text);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Todo;

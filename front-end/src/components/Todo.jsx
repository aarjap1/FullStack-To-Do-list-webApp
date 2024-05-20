import React, { useState, useEffect } from "react";

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
        console.log("Fetched todos:", data);
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
          console.log("Added todo:", data);
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
        console.log("Updated todo:", data); // Logging
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? data : todo
        );
        setTodos(updatedTodos);
        setEditId(null);
        setEditText("");
      })
      .catch((error) => console.error("Error updating todo:", error)); // Error handling
  };

  const deleteTodo = (id) => {
    fetch(`${backendUrl}/${id}`, { method: "DELETE" })
      .then(() => {
        console.log("Deleted todo with id:", id); // Logging
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting todo:", error)); // Error handling
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={addTodo}>Add</button>
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
                <button onClick={() => updateTodo(todo.id)}>Save</button>
              </>
            ) : (
              <>
                {todo.text}
                <button
                  onClick={() => {
                    setEditId(todo.id);
                    setEditText(todo.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;

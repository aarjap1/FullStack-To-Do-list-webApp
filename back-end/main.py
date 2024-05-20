from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoItem(BaseModel):
    id: int = None
    text: str

todos = []
id_counter = 1

@app.get("/api/todos", response_model=List[TodoItem])
def get_todos():
    return todos

@app.post("/api/todos", response_model=TodoItem)
def create_todo(todo: TodoItem):
    global id_counter
    todo.id = id_counter
    id_counter += 1
    todos.append(todo)
    print(f"Added todo: {todo}")  # Logging
    return todo

@app.put("/api/todos/{todo_id}", response_model=TodoItem)
def update_todo(todo_id: int, updated_todo: TodoItem):
    for todo in todos:
        if todo.id == todo_id:
            todo.text = updated_todo.text
            print(f"Updated todo: {todo}")  # Logging
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todos
    todos = [todo for todo in todos if todo.id != todo_id]
    print(f"Deleted todo with id: {todo_id}")  # Logging
    return {"message": "Todo deleted"}

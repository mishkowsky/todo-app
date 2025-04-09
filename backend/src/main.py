from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from src import models
from src.crud import create_todo_item, get_todo_item, update_todo_item, get_todo_items, delete_todo_item
from src.database import engine, get_db
from src.schemas import TodoItem, TodoItemCreate

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/todo/", response_model=TodoItem)
def create_todo(todo: TodoItemCreate, db: Session = Depends(get_db)):
    return create_todo_item(db=db, todo_item=todo)


@app.get("/todo/", response_model=list[TodoItem])
def read_todos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    todos = get_todo_items(db=db, skip=skip, limit=limit)
    return todos


@app.get("/todo/{todo_id}", response_model=TodoItem)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = get_todo_item(db=db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


@app.put("/todo/{todo_id}", response_model=TodoItem)
def update_todo(todo_id: int, todo: TodoItemCreate, db: Session = Depends(get_db)):
    updated_todo = update_todo_item(db=db, todo_id=todo_id, todo_item=todo)
    if updated_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo


@app.delete("/todo/{todo_id}", response_model=TodoItem)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    deleted_todo = delete_todo_item(db=db, todo_id=todo_id)
    if deleted_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return deleted_todo

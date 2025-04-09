from sqlalchemy.orm import Session
from src.models import TodoItem
from src.schemas import TodoItemCreate


def get_todo_items(db: Session, skip: int = 0, limit: int = 10):
    return db.query(TodoItem).offset(skip).limit(limit).all()


def create_todo_item(db: Session, todo_item: TodoItemCreate):
    db_todo_item = TodoItem(**todo_item.dict())
    db.add(db_todo_item)
    db.commit()
    db.refresh(db_todo_item)
    return db_todo_item


def get_todo_item(db: Session, todo_id: int):
    return db.query(TodoItem).filter(TodoItem.id == todo_id).first()


def update_todo_item(db: Session, todo_id: int, todo_item: TodoItemCreate):
    db_todo_item = get_todo_item(db, todo_id)
    if db_todo_item:
        for key, value in todo_item.dict().items():
            setattr(db_todo_item, key, value)
        db.commit()
        db.refresh(db_todo_item)
        return db_todo_item
    return None


def delete_todo_item(db: Session, todo_id: int):
    db_todo_item = get_todo_item(db, todo_id)
    if db_todo_item:
        db.delete(db_todo_item)
        db.commit()
        return db_todo_item
    return None

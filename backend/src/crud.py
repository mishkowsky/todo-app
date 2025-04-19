import datetime

from sqlalchemy import false, true
from sqlalchemy.orm import Session
from sqlalchemy.sql.operators import and_, or_

from src.models import Task
from src.schemas import TaskItemPatch, TaskItemCreateUpdate


def get_task_count(db: Session):
    return int(db.query(Task).count())


def get_task_items(db: Session):
    return db.query(Task).order_by(Task.deadline.asc(), Task.created_at.asc()).all()


def create_task_item(db: Session, task_item: TaskItemCreateUpdate):
    db_task_item = Task(**task_item.dict())
    db_task_item.created_at = datetime.datetime.now()
    db_task_item.completed = False
    print(db_task_item)
    db.add(db_task_item)
    db.commit()
    db.refresh(db_task_item)
    return db_task_item


def get_task_item(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()


def update_task_item(db: Session, task_id: int, task_item: TaskItemCreateUpdate | TaskItemPatch):
    db_task_item = get_task_item(db, task_id)
    if db_task_item:
        for key, value in task_item.dict().items():
            setattr(db_task_item, key, value)
        db.commit()
        db.refresh(db_task_item)
        return db_task_item
    return None


def delete_task_item(db: Session, task_id: int):
    db_task_item = get_task_item(db, task_id)
    if db_task_item:
        db.delete(db_task_item)
        db.commit()
        return db_task_item
    return None

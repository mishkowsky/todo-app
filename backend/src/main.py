import uvicorn
from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from src import models
from src.crud import create_task_item, get_task_item, update_task_item, get_task_items, delete_task_item, get_task_count
from src.database import engine, get_db
from src.schemas import TaskItem, TaskItemPatch, TaskItemCreateUpdate

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

prefix_router = APIRouter(prefix="")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@prefix_router.post("/tasks", response_model=TaskItem)
def create_task(task: TaskItemCreateUpdate, db: Session = Depends(get_db)):
    return create_task_item(db=db, task_item=task)


@prefix_router.get("/tasks", response_model=list[TaskItem])
def read_tasks(db: Session = Depends(get_db)):
    return get_task_items(db=db)


@prefix_router.get("/tasks/{task_id}", response_model=TaskItem)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = get_task_item(db=db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="task not found")
    return db_task


@prefix_router.put("/tasks/{task_id}", response_model=TaskItem)
def update_task(task_id: int, task: TaskItemCreateUpdate, db: Session = Depends(get_db)):
    updated_task = update_task_item(db=db, task_id=task_id, task_item=task)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="task not found")
    return updated_task


@prefix_router.delete("/tasks/{task_id}", response_model=TaskItem)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    deleted_task = delete_task_item(db=db, task_id=task_id)
    if deleted_task is None:
        raise HTTPException(status_code=404, detail="task not found")
    return deleted_task


@prefix_router.patch("/tasks/{task_id}", response_model=TaskItem)
def patch_completed_task(task_id: int, task: TaskItemPatch, db: Session = Depends(get_db)):
    updated_task = update_task_item(db=db, task_id=task_id, task_item=task)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="task not found")
    return updated_task


app.include_router(prefix_router)

if __name__ == '__main__':
    uvicorn.run(app, port=8000, host='0.0.0.0')

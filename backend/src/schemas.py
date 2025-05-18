from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class HealthCheck(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"

class TaskItemBase(BaseModel):
    title: str
    description: str = None


# class TaskItemCreate(TaskItemBase):
#     pass


class TaskItemCreateUpdate(TaskItemBase):
    deadline: Optional[datetime] = None


class TaskItem(TaskItemBase):
    id: int
    completed: bool
    created_at: datetime
    deadline: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class TaskItemPatch(BaseModel):
    completed: bool
    completed_at: Optional[datetime] = None

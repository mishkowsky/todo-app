from pydantic import BaseModel


class TodoItemBase(BaseModel):
    title: str
    is_done: bool
    description: str = None


class TodoItemCreate(TodoItemBase):
    pass


class TodoItem(TodoItemBase):
    id: int

    class Config:
        orm_mode = True

from sqlalchemy import Column, Integer, String, Boolean
from src.database import Base


class TodoItem(Base):
    __tablename__ = "todo_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    is_done = Column(Boolean)
    description = Column(String)

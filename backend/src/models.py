from sqlalchemy import Column, Integer, String, Boolean, DateTime
from src.database import Base


class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    deadline = Column(DateTime)
    created_at = Column(DateTime)
    completed = Column(Boolean)
    completed_at = Column(DateTime)

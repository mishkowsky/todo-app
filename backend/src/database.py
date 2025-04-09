import os
from dataclasses import dataclass
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

load_dotenv()


@dataclass(frozen=True)
class DBConfig:
    DBMS: str
    DRIVER: str
    HOSTNAME: str
    DATABASE: str
    USERNAME: str
    PASSWORD: str
    config_name: str
    PORT: str | None = None


class DBConfigInstance:

    def __init__(self, in_db_config: DBConfig):
        if in_db_config.PORT is None:
            self.DB_URI = '{}+{}://{}:{}@{}/{}'.format(
                in_db_config.DBMS, in_db_config.DRIVER, in_db_config.USERNAME,
                in_db_config.PASSWORD, in_db_config.HOSTNAME, in_db_config.DATABASE
            )
        else:
            self.DB_URI = '{}+{}://{}:{}@{}:{}/{}'.format(
                in_db_config.DBMS, in_db_config.DRIVER, in_db_config.USERNAME,
                in_db_config.PASSWORD, in_db_config.HOSTNAME, in_db_config.PORT, in_db_config.DATABASE
            )


DB_CONFIG = DBConfigInstance(
    DBConfig(
        DBMS=os.getenv("DBMS", "postgresql"),
        DRIVER=os.getenv("DB_DRIVER", "psycopg2"),
        HOSTNAME=os.getenv("DB_HOSTNAME", "localhost"),
        DATABASE=os.getenv("DB_DATABASE", "todo-app"),
        USERNAME=os.getenv("DB_USERNAME", "postgres"),
        PASSWORD=os.getenv("DB_PASSWORD", "postgres"),
        config_name='prod_config'
    ))

engine = create_engine(DB_CONFIG.DB_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    db.current_user_id = None
    try:
        yield db
    finally:
        db.close()

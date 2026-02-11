# app/db/database.py

from sqlmodel import create_engine
from core.config import POSTGRES_URI
from models.employee import Employee

engine = create_engine(POSTGRES_URI, echo=True)

def create_db_and_tables():
    Employee.metadata.create_all(engine)

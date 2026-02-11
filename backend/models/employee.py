# app/models/employee.py

from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr, field_validator
from sqlalchemy import Column, String

class Employee(SQLModel, table=True):
    employee_id: int = Field(primary_key=True)
    name: str
    dept: str
    role: str
    email: EmailStr = Field(
        sa_column=Column(String, unique=True, nullable=False)
    )
    experience: int = Field(default=0)
    description: Optional[str] = None

    @field_validator("experience")
    @classmethod
    def validate_experience(cls, value):
        if value < 0:
            raise ValueError("Experience cannot be negative")
        return value

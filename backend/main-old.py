postgres_uri = "postgresql://postgres.nnenchirytbpnrcuxmbi:Pratibha2004@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
# =========================
# IMPORTS
# =========================
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import EmailStr, field_validator
from sqlalchemy import Column, String
from fastapi.middleware.cors import CORSMiddleware


# =========================
# DATABASE CONFIG
# =========================

engine = create_engine(postgres_uri, echo=True)


# =========================
# MODEL
# =========================
class Employee(SQLModel, table=True):
    employee_id: int = Field(primary_key=True)
    name: str
    dept: str
    role: str
    email: EmailStr = Field(
        sa_column=Column(String, unique=True, nullable=False)
    )
    experience: int = Field(default=0)  # ✅ NEW FIELD
    description: Optional[str] = None

    # ✅ Experience Validation
    @field_validator("experience")
    @classmethod
    def validate_experience(cls, value):
        if value < 0:
            raise ValueError("Experience cannot be negative")
        return value


# =========================
# CREATE TABLES
# =========================
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# =========================
# LIFESPAN
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


# =========================
# FASTAPI APP
# =========================
app = FastAPI(lifespan=lifespan)


# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# CRUD OPERATIONS
# =====================================================

# ✅ Create Employee
@app.post("/employees/", response_model=Employee)
def create_employee(employee: Employee):
    with Session(engine) as session:

        # Check duplicate ID
        existing = session.get(Employee, employee.employee_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Employee ID already exists"
            )

        session.add(employee)
        session.commit()
        session.refresh(employee)
        return employee


# ✅ Get All Employees
@app.get("/employees/", response_model=List[Employee])
def get_all_employees():
    with Session(engine) as session:
        employees = session.exec(select(Employee)).all()
        return employees


# ✅ Get Single Employee
@app.get("/employees/{employee_id}", response_model=Employee)
def get_employee(employee_id: int):
    with Session(engine) as session:
        employee = session.get(Employee, employee_id)

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        return employee


# ✅ Update Employee
@app.put("/employees/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, updated_data: Employee):
    with Session(engine) as session:
        employee = session.get(Employee, employee_id)

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        employee.name = updated_data.name
        employee.dept = updated_data.dept
        employee.role = updated_data.role
        employee.email = updated_data.email
        employee.experience = updated_data.experience
        employee.description = updated_data.description

        session.commit()
        session.refresh(employee)
        return employee


# ✅ Delete Employee
@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int):
    with Session(engine) as session:
        employee = session.get(Employee, employee_id)

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        session.delete(employee)
        session.commit()

        return {"message": "Employee deleted successfully"}

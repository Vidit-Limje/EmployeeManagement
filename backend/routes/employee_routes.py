# ==========================================================
# app/routes/employee_routes.py
# ==========================================================
"""
Employee Routes

All endpoints return JSON.

Base URL:
    /employees

Data Format (Employee JSON):
{
    "employee_id": int,
    "name": str,
    "dept": str,
    "role": str,
    "email": str,
    "experience": int,
    "description": str | null
}
"""

# FastAPI router and exception handling
from fastapi import APIRouter, HTTPException

# SQLModel session for DB transactions and select query helper
from sqlmodel import Session, select

# For response model typing (List of employees)
from typing import List

# Logging for monitoring and debugging
import logging

# Import database engine
from db.database import engine

# Import ORM model
from models.employee import Employee


# -------------------------------------------------
# Initialize module-level logger
# This helps track API activity in logs
# -------------------------------------------------
logger = logging.getLogger(__name__)

# -------------------------------------------------
# Create API router
# All routes will be prefixed with /employees
# -------------------------------------------------
router = APIRouter(prefix="/employees", tags=["Employees"])


# =====================================================
# CREATE EMPLOYEE
# =====================================================
@router.post("/", response_model=Employee)
def create_employee(employee: Employee):
    """
    Create a new employee.

    Expected JSON Body:
    {
        "employee_id": 101,
        "name": "John Doe",
        "dept": "AI",
        "role": "ML Engineer",
        "email": "john@example.com",
        "experience": 3,
        "description": "AI specialist"
    }
    """

    # Log incoming create request
    logger.info(f"Attempting to create employee ID {employee.employee_id}")

    # Open DB session (transaction scope)
    with Session(engine) as session:
        try:
            # Check if employee already exists (primary key lookup)
            existing = session.get(Employee, employee.employee_id)

            if existing:
                # Prevent duplicate primary key insert
                logger.warning(
                    f"Duplicate employee ID attempt: {employee.employee_id}"
                )
                raise HTTPException(
                    status_code=400,
                    detail="Employee ID already exists"
                )

            # Add new employee object to session
            session.add(employee)

            # Commit transaction → writes to DB
            session.commit()

            # Refresh object to get DB-generated values (if any)
            session.refresh(employee)

            logger.info(
                f"Employee created successfully: {employee.employee_id}"
            )

            return employee

        except Exception as e:
            # Rollback transaction on error to maintain DB integrity
            session.rollback()

            logger.error(
                f"Error creating employee {employee.employee_id}: {str(e)}"
            )

            raise


# =====================================================
# GET ALL EMPLOYEES
# =====================================================
@router.get("/", response_model=List[Employee])
def get_all_employees():
    """
    Get list of all employees.

    Returns:
        List[Employee]
    """

    logger.info("Fetching all employees")

    # Open DB session
    with Session(engine) as session:
        # Execute SELECT * FROM employee
        employees = session.exec(select(Employee)).all()

        logger.info(f"Returned {len(employees)} employees")

        return employees


# =====================================================
# GET SINGLE EMPLOYEE
# =====================================================
@router.get("/{employee_id}", response_model=Employee)
def get_employee(employee_id: int):
    """
    Get employee by ID.

    Path Parameter:
        employee_id (int)
    """

    logger.info(f"Fetching employee ID {employee_id}")

    with Session(engine) as session:
        # Fetch employee using primary key
        employee = session.get(Employee, employee_id)

        # If employee not found → return 404
        if not employee:
            logger.error(f"Employee not found: {employee_id}")
            raise HTTPException(
                status_code=404,
                detail="Employee not found"
            )

        logger.info(f"Employee found: {employee_id}")

        return employee


# =====================================================
# UPDATE EMPLOYEE
# =====================================================
@router.put("/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, updated_data: Employee):
    """
    Update existing employee.

    Path Parameter:
        employee_id (int)

    Expected JSON Body:
        Same format as Employee model
    """

    logger.info(f"Attempting to update employee {employee_id}")

    with Session(engine) as session:
        try:
            # Fetch existing employee record
            employee = session.get(Employee, employee_id)

            # If not found → return 404
            if not employee:
                logger.error(f"Update failed. Employee not found: {employee_id}")
                raise HTTPException(
                    status_code=404,
                    detail="Employee not found"
                )

            # Manually update fields
            employee.name = updated_data.name
            employee.dept = updated_data.dept
            employee.role = updated_data.role
            employee.email = updated_data.email
            employee.experience = updated_data.experience
            employee.description = updated_data.description

            # Commit changes to DB
            session.commit()

            # Refresh updated object
            session.refresh(employee)

            logger.info(f"Employee updated successfully: {employee_id}")

            return employee

        except Exception as e:
            # Rollback if update fails
            session.rollback()

            logger.error(
                f"Error updating employee {employee_id}: {str(e)}"
            )

            raise


# =====================================================
# DELETE EMPLOYEE
# =====================================================
@router.delete("/{employee_id}")
def delete_employee(employee_id: int):
    """
    Delete employee by ID.

    Path Parameter:
        employee_id (int)

    Returns:
        {"message": "Employee deleted successfully"}
    """

    logger.info(f"Attempting to delete employee {employee_id}")

    with Session(engine) as session:
        try:
            # Fetch employee
            employee = session.get(Employee, employee_id)

            # If not found → return 404
            if not employee:
                logger.error(
                    f"Delete failed. Employee not found: {employee_id}"
                )
                raise HTTPException(
                    status_code=404,
                    detail="Employee not found"
                )

            # Delete employee record
            session.delete(employee)

            # Commit deletion
            session.commit()

            logger.info(f"Employee deleted successfully: {employee_id}")

            return {"message": "Employee deleted successfully"}

        except Exception as e:
            # Rollback if delete fails
            session.rollback()

            logger.error(
                f"Error deleting employee {employee_id}: {str(e)}"
            )

            raise

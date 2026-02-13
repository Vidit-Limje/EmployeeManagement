# ==========================================================
# app/main.py
# ==========================================================

# FastAPI core imports
from fastapi import FastAPI, Request

# Used for startup/shutdown lifecycle management
from contextlib import asynccontextmanager

# CORS middleware for frontend-backend communication
from fastapi.middleware.cors import CORSMiddleware

# Standard JSON response for custom error handler
from fastapi.responses import JSONResponse

# Logging and request timing
import logging
import time

# Database table initialization function
from db.database import create_db_and_tables

# Import employee router
from routes.employee_routes import router as employee_router

# Custom logging configuration setup
from core.logging_config import setup_logging   # 🔥 initialize logging format/handlers


# =========================
# SETUP LOGGING
# =========================
# Initialize logging configuration (format, level, handlers)
setup_logging()

# Create module-level logger
logger = logging.getLogger(__name__)


# =========================
# LIFESPAN (Startup & Shutdown Events)
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs once when the application starts and once when it shuts down.

    Startup:
        - Logs startup event
        - Ensures database tables are created

    Shutdown:
        - Logs shutdown event
    """

    logger.info("Starting application...")

    # Ensure DB tables exist before serving requests
    create_db_and_tables()

    logger.info("Database tables ensured.")

    # Yield control to the app (app runs here)
    yield

    # Runs on application shutdown
    logger.info("Shutting down application...")


# =========================
# CREATE FASTAPI APP
# =========================
# Attach lifespan handler for startup/shutdown logic
app = FastAPI(lifespan=lifespan)


# =========================
# REQUEST LOGGING MIDDLEWARE
# =========================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log every incoming HTTP request.

    Logs:
        - HTTP method
        - URL path
        - Response status code
        - Processing time
    """

    # Record start time
    start_time = time.time()

    # Process request
    response = await call_next(request)

    # Calculate total request time
    process_time = time.time() - start_time

    # Log structured request details
    logger.info(
        f"{request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Time: {process_time:.4f}s"
    )

    return response


# =========================
# GLOBAL EXCEPTION HANDLER
# =========================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler.

    Purpose:
        - Prevents raw stack traces from leaking to clients
        - Logs full error internally
        - Returns generic 500 response to user
    """

    logger.error(
        f"Unhandled error on {request.method} {request.url.path}: {str(exc)}"
    )

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


# =========================
# CORS CONFIGURATION
# =========================
# Allows frontend (React/Vercel) to call backend APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # ⚠️ In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# INCLUDE ROUTES
# =========================
# Register employee API routes under /employees
app.include_router(employee_router)

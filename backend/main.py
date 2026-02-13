# app/main.py

from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time

from db.database import create_db_and_tables
from routes.employee_routes import router as employee_router
from core.logging_config import setup_logging   # 🔥 import logging setup


# =========================
# SETUP LOGGING
# =========================
setup_logging()
logger = logging.getLogger(__name__)


# =========================
# LIFESPAN
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    create_db_and_tables()
    logger.info("Database tables ensured.")
    yield
    logger.info("Shutting down application...")


# =========================
# FASTAPI APP
# =========================
app = FastAPI(lifespan=lifespan)


# =========================
# REQUEST LOGGING MIDDLEWARE
# =========================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time

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
    logger.error(
        f"Unhandled error on {request.method} {request.url.path}: {str(exc)}"
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# INCLUDE ROUTES
# =========================
app.include_router(employee_router)

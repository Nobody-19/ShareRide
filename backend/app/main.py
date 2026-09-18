from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import CORS_ORIGINS, UPLOAD_DIR
from app.core.database import Base, engine
from app.routers import auth, users, requests as requests_router, responses, rides, notifications
from app.seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="ShareRide API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(requests_router.router)
app.include_router(responses.router)
app.include_router(rides.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "ShareRide API"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}

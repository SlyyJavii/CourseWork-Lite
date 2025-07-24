# main.py
from fastapi import FastAPI
from routers import users, courses, tasks
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(
    title="CourseWork Lite API",
    description="API for managing academic tasks and courses.",
    version="1.0.0"
)

# Add CORS Middleware so the frontend can talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for different functionalities / endpoints
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(tasks.router)

# Root Endpoint
@app.get("/", tags=["Root"])
async def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the CourseWork Lite API!"}

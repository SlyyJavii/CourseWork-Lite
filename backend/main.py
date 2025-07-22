from fastapi import FastAPI
from routers import users, courses, tasks

# --- Application Setup ---

# Initialize FastAPI app
app = FastAPI(
    title="CourseWork Lite API",
    description="API for managing academic tasks and courses.",
    version="0.1.0"
)
# Include routers for different functionalities / endpoints
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(tasks.router)

# --- Root Endpoint ---

@app.get("/", tags=["Root"])
async def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the CourseWork Lite API!"}
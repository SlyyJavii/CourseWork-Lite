import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, courses, tasks

# --- Application Setup ---
# Initialize FastAPI app
app = FastAPI(
    title="CourseWork Lite API",
    description="API for managing academic tasks and courses.",
    version="1.0.0"
)

# Load environment variables from .env file
load_dotenv()
# Configure CORS settings
# cors_origins = os.getenv("CORS_ORIGINS", "")

# origins = [origin.strip() for origin in cors_origins.split(",")]

# if origins:
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=origins,       # The list of origins that are allowed to make requests
#         allow_credentials=True,      # Allows cookies to be included in requests
#         allow_methods=["*"],         # Allows all methods (GET, POST, etc.)
#         allow_headers=["*"],         # Allows all headers
#     )
#     print(f"CORS middleware configured for origins: {origins}")
# else:
#     raise Exception("CORS middleware not configured. No CORS_ORIGINS environment variable found.")

# Include routers for different functionalities / endpoints
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(tasks.router)

# --- Root Endpoint ---

@app.get("/", tags=["Root"])
async def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the CourseWork Lite API!"}
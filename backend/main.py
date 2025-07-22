# main.py

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from fastapi import FastAPI
from backend.routers import users, courses, tasks
from passlib.context import CryptContext

# --- Application Setup ---

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="CourseWork Lite API",
    description="API for managing academic tasks and courses.",
    version="0.1.0"
)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(tasks.router)

# --- Security & Hashing ---

# Setup password hashing context
# This tells passlib to use bcrypt for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Database Connection ---

# Get MongoDB connection string from environment variables
MONGO_URI = os.getenv("MONGO_URI")

# Establish connection to the database
client = MongoClient(MONGO_URI)
db = client.coursework_lite_db # Use or create a database named 'coursework_lite_db'

# Create handles for your collections (like tables in SQL)
users_collection = db.users
courses_collection = db.courses
tasks_collection = db.tasks

print("Successfully connected to MongoDB Atlas.")

# --- API Endpoints ---

@app.get("/", tags=["Root"])
async def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the CourseWork Lite API!"}
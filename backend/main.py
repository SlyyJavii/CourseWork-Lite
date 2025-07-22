# main.py

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr, Field
from fastapi import FastAPI, HTTPException, status
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

# --- Pydantic Models (Data Schemas) ---
# These models define the shape and data types for API requests and responses.

class UserCreate(BaseModel):
    """Model for creating a new user."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    """Model for the response when a user is created or fetched."""
    username: str
    email: EmailStr
    
    class Config:
        from_attributes = True


# --- API Endpoints ---

@app.get("/", tags=["Root"])
async def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the CourseWork Lite API!"}

# --- User Endpoints ---
@app.post("/users/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Users"])
async def register_user(user: UserCreate):
    """
    Handles user registration.
    
    - Checks if a user with the same email already exists.
    - Hashes the password securely using bcrypt.
    - Stores the new user in the database.
    """
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Create the user document to be inserted
    user_document = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password
    }
    
    # Insert the new user into the collection
    users_collection.insert_one(user_document)
    
    return user_document

@app.post("/token", tags=["Users"])
async def login_for_access_token():
    """Placeholder: This endpoint will handle user login and JWT generation."""
    # Logic will include:
    # 1. Finding the user by email.
    # 2. Verifying the provided password against the stored hash.
    # 3. Creating and returning a JWT if credentials are valid.
    return {"message": "Login endpoint placeholder."}

# --- Course Endpoints ---
@app.post("/courses", tags=["Courses"])
async def create_course():
    """Placeholder: This endpoint will create a new course."""
    # Logic will be protected and require an authenticated user (via JWT).
    return {"message": "Create course endpoint placeholder."}

@app.get("/courses", tags=["Courses"])
async def get_all_courses():
    """Placeholder: This endpoint will retrieve all courses for the logged-in user."""
    # Logic will be protected and require an authenticated user.
    return {"message": "Get all courses endpoint placeholder."}

@app.get("/courses/{course_id}", tags=["Courses"])
async def get_course(course_id: str):
    """Placeholder: This endpoint will retrieve a specific course by its ID."""
    # Logic will be protected and require an authenticated user.
    return {"message": f"Get course {course_id} endpoint placeholder."}

@app.put("/courses/{course_id}", tags=["Courses"])
async def update_course(course_id: str):
    """Placeholder: This endpoint will update a specific course by its ID."""
    # Logic will be protected and require an authenticated user.
    return {"message": f"Update course {course_id} endpoint placeholder."}

# --- Task Endpoints ---
@app.get("/tasks", tags=["Tasks"])
async def get_all_tasks():
    """Placeholder: This endpoint will retrieve all tasks for the logged-in user."""
    # Logic will be protected and require an authenticated user.
    return {"message": "Get all tasks endpoint placeholder."}

@app.post("/tasks", tags=["Tasks"])
async def create_task():
    """Placeholder: This endpoint will create a new task."""
    # Logic will be protected and require an authenticated user.
    return {"message": "Create task endpoint placeholder."}

@app.get("/tasks/{task_id}", tags=["Tasks"])
async def get_task(task_id: str):
    """Placeholder: This endpoint will retrieve a specific task by its ID."""
    # Logic will be protected and require an authenticated user.
    return {"message": f"Get task {task_id} endpoint placeholder."}

@app.put("/tasks/{task_id}", tags=["Tasks"])
async def update_task(task_id: str):    
    """Placeholder: This endpoint will update a specific task by its ID."""
    # Logic will be protected and require an authenticated user.
    return {"message": f"Update task {task_id} endpoint placeholder."}

@app.delete("/tasks/{task_id}", tags=["Tasks"])
async def delete_task(task_id: str):
    """Placeholder: This endpoint will delete a specific task by its ID."""
    # Logic will be protected and require an authenticated user.
    return {"message": f"Delete task {task_id} endpoint placeholder."}
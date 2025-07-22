from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from database import users_collection

# --- Security & Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

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
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
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
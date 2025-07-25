from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from database import users_collection
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# --- Pydantic Models (Data Schemas) ---
# These models define the shape and data types for API requests and responses.

class UserCreation(BaseModel):
    """Model for creating a new user."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class CreationResponse(BaseModel):
    """Model for the response when a user is created or fetched."""
    username: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    """Model for user login."""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Model for the response after a successful login."""
    access_token: str
    token_type: str = "bearer"
    model_config = ConfigDict(from_attributes=True)

class UserPasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

class UserEmailChange(BaseModel):
    new_email: EmailStr
    password: str

# --- API Endpoints ---
@router.post("/register", response_model=CreationResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreation):
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
    hashed_password = get_password_hash(user.password)

    # Create the user document to be inserted
    user_document = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password
    }
    
    # Insert the new user into the collection
    users_collection.insert_one(user_document)
    
    return user_document

@router.post("/login", response_model=LoginResponse,status_code=status.HTTP_202_ACCEPTED)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Handles user login.
    
    - Verifies the user's email and password.
    - Returns a JWT token if successful.
    """
    # Find the user by email
    existing_user = get_user_by_email(form_data.username)
    # Verify the password
    if not existing_user or not verify_password(form_data.password, existing_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Create a JWT token for the user
    access_token = create_access_token(data={"sub": existing_user["email"]})

    return {
        "access_token": access_token
    }

@router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    password_data: UserPasswordChange,
    current_user: dict = Depends(get_current_user)
):
    """Allows an authenticated user to change their password."""
    if not verify_password(password_data.current_password, current_user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password.")
    new_hashed_password = get_password_hash(password_data.new_password)
    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password_hash": new_hashed_password}}
    )
    return

@router.put("/me/email", response_model=CreationResponse, status_code=status.HTTP_200_OK)
async def change_email(
    email_data: UserEmailChange,
    current_user: dict = Depends(get_current_user)
):
    """Allows an authenticated user to change their email."""
    if not verify_password(email_data.password, current_user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password.")

    if users_collection.find_one({"email": email_data.new_email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This email is already in use.")

    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"email": email_data.new_email}}
    )
    updated_user = users_collection.find_one({"_id": current_user["_id"]})
    return updated_user

# --- Utility Functions ---
def get_user_by_email(email: str):
    """
    Fetch a user from the database by their email.
    
    :param email: The email of the user to fetch.
    :return: The user document if found, otherwise None.
    """
    return users_collection.find_one({"email": email})
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from database import users_collection
from auth import get_password_hash, verify_password, create_access_token

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# --- Pydantic Models (Data Schemas) ---

class UserCreation(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class CreationResponse(BaseModel):
    username: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    model_config = ConfigDict(from_attributes=True)

# --- API Endpoints ---

@router.post("/register", response_model=CreationResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreation):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    hashed_password = get_password_hash(user.password)

    user_document = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password
    }

    users_collection.insert_one(user_document)

    return {
        "username": user.username,
        "email": user.email
    }

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_202_ACCEPTED)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    existing_user = get_user_by_email(form_data.username)
    if not existing_user or not verify_password(form_data.password, existing_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    access_token = create_access_token(data={"sub": existing_user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# --- Utility Functions ---

def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})

@router.get("/")
async def get_all_users():
    users = await users_collection.find().to_list(100)
    for user in users:
        user["_id"] = str(user["_id"])
    return {"users": users}

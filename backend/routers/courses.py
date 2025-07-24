from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId

import auth
from database import courses_collection, tasks_collection

# --- Pydantic Models (Data Schemas) ---
class CourseBase(BaseModel):
    """Model for creating a new course."""
    courseName: str = Field(..., min_length=3)
    courseCode: Optional[str] = None
    colorTag: Optional[str] = None
    description: Optional[str] = None

class CourseCreate(CourseBase):
    """Model for creating a new course."""
    pass

class CourseUpdate(CourseBase):
    pass

class CourseResponse(CourseBase):
    """Model for the response when a course is created or fetched."""
    id: str

# --- Router Configuration ---
router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
    dependencies=[Depends(auth.get_current_user)]  # Ensure user is authenticated
)

# --- Utility Functions ---
def format_course(course) -> dict:
    """Formats the course document from DB as a dictionary."""
    return {
        "id": str(course["_id"]),
        "courseName": course["courseName"],
        "courseCode": course.get("courseCode"),
        "colorTag": course.get("colorTag"),
        "description": course.get("description")
    }

async def get_course_or_404(
        course_id: str, 
        current_user: dict = Depends(auth.get_current_user)
    ) -> dict:
    """
    A reusable dependency that fetches a course by its ID and verifies
    that it belongs to the current user. Raises a 404 if not found.
    """
    try:
        # This query ensures a user can only access their own courses
        query = {"_id": ObjectId(course_id), "userId": current_user["_id"]}
        course = courses_collection.find_one(query)
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        return course
    except InvalidId:
        # Catches cases where the course_id is not a valid MongoDB ObjectId format
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Course ID format")

# --- API Endpoints ---
@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(course: CourseCreate, current_user: dict = Depends(auth.get_current_user)):
    """Creates a new course for the authenticated user."""
    course_document = course.model_dump()
    course_document["userId"] = current_user["_id"]  # Associate course with the authenticated user

    result = courses_collection.insert_one(course_document)
    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create course."
        )
    created_course = courses_collection.find_one({"_id": result.inserted_id})
    if not created_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found after creation."
        )
    return format_course(created_course)

@router.get("/", response_model=list[CourseResponse],status_code=status.HTTP_200_OK)
async def get_all_courses(current_user: dict = Depends(auth.get_current_user)):
    """Retrieves all courses for the authenticated user."""
    courses = courses_collection.find({"userId": current_user["_id"]})
    return [format_course(course) for course in courses]

@router.get("/{course_id}", response_model=CourseResponse, status_code=status.HTTP_200_OK)
async def get_single_course(course: dict = Depends(get_course_or_404)):
    """Retrieves a specific course by its ID."""
    return format_course(course)

@router.put("/{course_id}", status_code=status.HTTP_200_OK)
async def update_course(
    update_data: CourseUpdate, 
    course: dict = Depends(get_course_or_404)
):
    """Updates the details of a specific course."""
    courses_collection.update_one(
        {"_id": course["_id"]},
        {"$set": update_data.model_dump()}
    )

    updated_course = courses_collection.find_one({"_id": course["_id"]})
    return format_course(updated_course)

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course: dict = Depends(get_course_or_404)):
    """Deletes a specific course and all associated tasks."""
    # Dependency ensures course exists and belongs to the user
    course_id = course["_id"]
    # Delete Course
    courses_collection.delete_one({"_id": course_id})
    # Delete all tasks associated with this course
    tasks_collection.delete_many({"courseId": course_id})

    return
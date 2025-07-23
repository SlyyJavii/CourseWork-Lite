from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

import auth
from database import tasks_collection, courses_collection

# --- Pydantic Models ---

class TaskBase(BaseModel):
    title: str = Field(..., min_length=3)
    description: Optional[str] = None
    dueDate: Optional[datetime] = None
    priority: str = "Medium"
    status: str = "active"

class TaskCreate(TaskBase):
    courseId: str

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3)
    description: Optional[str] = None
    dueDate: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(TaskBase):
    id: str
    courseId: str
    model_config = ConfigDict(from_attributes=True)

# --- Helper Functions & Dependencies ---

def format_task(task) -> dict:
    """Converts a task document from the DB into a dictionary."""
    return {
        "id": str(task["_id"]),
        "courseId": str(task["courseId"]),
        "title": task["title"],
        "description": task.get("description"),
        "dueDate": task.get("dueDate"),
        "priority": task["priority"],
        "status": task["status"]
    }

async def get_task_or_404(
    task_id: str,
    current_user: dict = Depends(auth.get_current_user)
) -> dict:
    """A reusable dependency that fetches a task and verifies ownership."""
    try:
        query = {"_id": ObjectId(task_id), "userId": current_user["_id"]}
        task = tasks_collection.find_one(query)
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Task ID format")

# --- Router Setup ---

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
    dependencies=[Depends(auth.get_current_user)] # Protect all routes
)

# --- API Endpoints ---

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate, current_user: dict = Depends(auth.get_current_user)):
    """Creates a new task for one of the user's courses."""
    try:
        # Verify the course belongs to the current user before adding a task to it
        course = courses_collection.find_one({
            "_id": ObjectId(task.courseId),
            "userId": current_user["_id"]
        })
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found for this user")
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Course ID format")

    task_document = task.model_dump()
    task_document["userId"] = current_user["_id"]
    task_document["courseId"] = ObjectId(task.courseId)
    
    result = tasks_collection.insert_one(task_document)
    created_task = tasks_collection.find_one({"_id": result.inserted_id})
    
    return format_task(created_task)

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    course_id: Optional[str] = None, # Optional query parameter to filter by course
    current_user: dict = Depends(auth.get_current_user)
):
    """Retrieves all tasks for the current user, with optional filtering by course."""
    query = {"userId": current_user["_id"]}
    if course_id:
        try:
            query["courseId"] = ObjectId(course_id)
        except InvalidId:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Course ID format")
        
    user_tasks = tasks_collection.find(query)
    return [format_task(task) for task in user_tasks]

@router.get("/{task_id}", response_model=TaskResponse)
async def get_single_task(task: dict = Depends(get_task_or_404)):
    """Retrieves a single task by its ID."""
    return format_task(task)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    update_data: TaskUpdate,
    task: dict = Depends(get_task_or_404)
):
    """Updates the details of an existing task."""
    # model_dump(exclude_unset=True) ensures we only update fields that were provided
    update_query = {"$set": update_data.model_dump(exclude_unset=True)}
    
    if update_query["$set"]: # Only run update if there is data to update
        tasks_collection.update_one({"_id": task["_id"]}, update_query)

    updated_task = tasks_collection.find_one({"_id": task["_id"]})
    return format_task(updated_task)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task: dict = Depends(get_task_or_404)):
    """Deletes a task by its ID."""
    tasks_collection.delete_one({"_id": task["_id"]})
    return

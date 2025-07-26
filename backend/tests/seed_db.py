# seed_db.py
# A standalone script to populate the MongoDB database with sample data for a single user.

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import bcrypt

# --- SETUP ---

# Load environment variables from .env file
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "coursework_lite_db") # Default if not set

# --- DATABASE CONNECTION ---

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    users_collection = db.users
    courses_collection = db.courses
    tasks_collection = db.tasks
    print(f"✅ Successfully connected to MongoDB database: '{MONGO_DB_NAME}'")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    exit()

# --- UTILITY FUNCTIONS ---

def get_password_hash(password: str) -> str:
    """Hashes a plain-text password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_password_bytes.decode('utf-8')

# --- SAMPLE DATA FOR A SINGLE USER ---

# 1. Define the 5 sample users for the demonstration
users_data = [
    {"username": "Demo User 1", "email": "leon@fiu.edu", "password": "password123"},
    {"username": "Demo User 2", "email": "ehab@fiu.edu", "password": "password123"},
    {"username": "Demo User 3", "email": "javi@fiu.edu", "password": "password123"},
    {"username": "Demo User 4", "email": "haze@fiu.edu", "password": "password123"},
    {"username": "Demo User 5", "email": "anel@fiu.edu", "password": "password123"},
]

# 2. Define the courses for this user
courses_data = [
    {"courseName": "Software Engineering I", "courseCode": "CEN4010", "colorTag": "#4A90E2"},
    {"courseName": "Calculus II", "courseCode": "MAC2312", "colorTag": "#F5A623"},
    {"courseName": "Database Systems", "courseCode": "COP4540", "colorTag": "#50E3C2"},
    {"courseName": "Intro to Art History", "courseCode": "ARH2000", "colorTag": "#B8E986"},
]

# 3. Define a rich set of tasks with varied due dates and priorities
def get_tasks_data(course_docs):
    now = datetime.now()
    return [
        # --- Past Due Tasks (for "Past Due" reminder) ---
        {
            "courseName": "Software Engineering I",
            "title": "Submit Final Project Proposal",
            "description": "The proposal was due last week.",
            "dueDate": now - timedelta(days=5),
            "priority": "High",
            "status": "active"
        },
        {
            "courseName": "Calculus II",
            "title": "Complete Problem Set 3",
            "description": "Includes integration by parts.",
            "dueDate": now - timedelta(days=2),
            "priority": "Medium",
            "status": "active"
        },
        # --- Due Soon Task (for "Due Soon" reminder) ---
        {
            "courseName": "Database Systems",
            "title": "Prepare for Quiz on Normalization",
            "description": "Review 1NF, 2NF, and 3NF.",
            "dueDate": now + timedelta(hours=12),
            "priority": "High",
            "status": "active"
        },
        # --- Future Tasks ---
        {
            "courseName": "Software Engineering I",
            "title": "Develop UI Mockups",
            "description": "Use Figma to create the dashboard view.",
            "dueDate": now + timedelta(days=7),
            "priority": "Medium",
            "status": "active"
        },
        {
            "courseName": "Intro to Art History",
            "title": "Read Chapter 1: The Renaissance",
            "description": "Focus on early Italian painters.",
            "dueDate": now + timedelta(days=10),
            "priority": "Low",
            "status": "active"
        },
        # --- Completed/Archived Tasks ---
        {
            "courseName": "Database Systems",
            "title": "Install PostgreSQL",
            "description": "Setup local database environment.",
            "dueDate": now - timedelta(days=15),
            "priority": "High",
            "status": "complete"
        },
        {
            "courseName": "Intro to Art History",
            "title": "Visit local museum",
            "description": "Write a short reflection on one piece.",
            "dueDate": now - timedelta(days=20),
            "priority": "Medium",
            "status": "complete"
        }
    ]


# --- MAIN SEEDING LOGIC ---

def seed_database():
    """
    Clears existing data and populates the database for a single demo user.
    """
    print("\n🧹 Clearing all existing data from collections...")
    users_collection.delete_many({})
    courses_collection.delete_many({})
    tasks_collection.delete_many({})
    print("✅ Collections cleared.")

    print("\n🌱 Starting to seed the database for multiple users...")

    # 1. Create the user
    for user_data in users_data:
        print(f"👤 Creating user: {user_data['username']}")
        user_doc = {
            "username": user_data["username"],
            "email": user_data["email"],
            "password_hash": get_password_hash(user_data["password"]),
        }
        user_result = users_collection.insert_one(user_doc)
        user_id = user_result.inserted_id

        # 2. Create the courses for the user
        course_docs = []
        for course_info in courses_data:
            print(f"  📘 Creating course: {course_info['courseName']}")
            course_doc = {
                "userId": user_id,
                **course_info # Unpack the course details
            }
            course_result = courses_collection.insert_one(course_doc)
            # Store the created document along with its new ID for task association
            course_docs.append({"_id": course_result.inserted_id, **course_doc})
        
        # 3. Create the tasks, associating them with the correct course
        print("\n  📝 Creating tasks...")
        tasks_to_create = get_tasks_data(course_docs)
        for task_info in tasks_to_create:
            # Find the corresponding course document to get its ID
            course = next((c for c in course_docs if c["courseName"] == task_info["courseName"]), None)
            if course:
                task_doc = {
                    "userId": user_id,
                    "courseId": course["_id"],
                    "title": task_info["title"],
                    "description": task_info["description"],
                    "dueDate": task_info["dueDate"],
                    "priority": task_info["priority"],
                    "status": task_info["status"],
                }
                tasks_collection.insert_one(task_doc)
                print(f"    ✅ Created task: '{task_info['title']}' for course '{task_info['courseName']}'")
            else:
                print(f"    ⚠️ Could not find course '{task_info['courseName']}' to create task.")

    print(f"\n\n🎉 Database seeding complete!")
    print(f"Created 1 user, {len(courses_data)} courses, and {len(tasks_to_create)} tasks.")
    print(f"You can now log in as '{user_data['email']}' with the password 'password123'.")


if __name__ == "__main__":
    seed_database()

# A standalone script to populate the MongoDB database with sample data.

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

# --- DATABASE CONNECTION ---

try:
    client = MongoClient(MONGO_URI)
    db = client.coursework_lite_db
    users_collection = db.users
    courses_collection = db.courses
    tasks_collection = db.tasks
    print("✅ Successfully connected to MongoDB.")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    exit()

# --- UTILITY FUNCTIONS (from auth.py) ---

def get_password_hash(password: str) -> str:
    """Hashes a plain-text password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_password_bytes.decode('utf-8')

# --- SAMPLE DATA ---

# 5 sample users
users_data = [
    {"username": "leonel_p", "email": "leonel@example.com", "password": "password123"},
    {"username": "ehab_k", "email": "ehab@example.com", "password": "password123"},
    {"username": "anelys_i", "email": "anelys@example.com", "password": "password123"},
    {"username": "hazel_h", "email": "hazel@example.com", "password": "password123"},
    {"username": "javier_b", "email": "javier@example.com", "password": "password123"},
]

# 4 sample courses per user
courses_data = [
    {"courseName": "Software Engineering I", "courseCode": "CEN4010", "colorTag": "#4A90E2"},
    {"courseName": "Calculus II", "courseCode": "MAC2312", "colorTag": "#F5A623"},
    {"courseName": "Database Systems", "courseCode": "COP4540", "colorTag": "#50E3C2"},
    {"courseName": "Intro to Art History", "courseCode": "ARH2000", "colorTag": "#B8E986"},
]

# 4 sample tasks per course
tasks_data = [
    {"title": "Complete Chapter 5 Reading", "priority": "Low"},
    {"title": "Submit Project Proposal", "priority": "High"},
    {"title": "Study for Midterm Exam", "priority": "High"},
    {"title": "Weekly Discussion Post", "priority": "Medium"},
]

# --- MAIN SEEDING LOGIC ---

def seed_database():
    """
    Clears existing data and populates the database with new sample data.
    """
    print("\n🧹 Clearing existing data...")
    users_collection.delete_many({})
    courses_collection.delete_many({})
    tasks_collection.delete_many({})
    print("✅ Collections cleared.")

    print("\n🌱 Starting to seed the database...")
    total_tasks_created = 0

    # Loop through each user
    for user_info in users_data:
        print(f"\n👤 Creating user: {user_info['username']}")
        
        # Hash password and create user document
        user_doc = {
            "username": user_info["username"],
            "email": user_info["email"],
            "password_hash": get_password_hash(user_info["password"]),
        }
        user_result = users_collection.insert_one(user_doc)
        user_id = user_result.inserted_id

        # For each user, create their courses
        for course_info in courses_data:
            print(f"  📘 Creating course: {course_info['courseName']}")
            
            course_doc = {
                "userId": user_id,
                "courseName": course_info["courseName"],
                "courseCode": course_info["courseCode"],
                "colorTag": course_info["colorTag"],
                "description": f"A sample course for {user_info['username']}.",
            }
            course_result = courses_collection.insert_one(course_doc)
            course_id = course_result.inserted_id

            # For each course, create its tasks
            for i, task_info in enumerate(tasks_data):
                due_date = datetime.now() + timedelta(days=(i * 5) + 3) # Stagger due dates
                
                task_doc = {
                    "userId": user_id,
                    "courseId": course_id,
                    "title": task_info["title"],
                    "description": "This is a sample task description.",
                    "dueDate": due_date,
                    "priority": task_info["priority"],
                    "status": "active",
                }
                tasks_collection.insert_one(task_doc)
                total_tasks_created += 1
                print(f"    ✅ Created task: {task_info['title']}")

    print(f"\n\n🎉 Database seeding complete! Created {len(users_data)} users, {len(users_data) * len(courses_data)} courses, and {total_tasks_created} tasks.")
    print("You can now log in with any of the sample users. The password for all users is: password123")


if __name__ == "__main__":
    seed_database()

# A standalone script to completely wipe all data from the database collections.

import os
from dotenv import load_dotenv
from pymongo import MongoClient

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

# --- MAIN WIPE LOGIC ---

def wipe_database():
    """
    Deletes all documents from the users, courses, and tasks collections
    after receiving user confirmation.
    """
    print("\n🚨 WARNING: This script will permanently delete all data from the following collections:")
    print(f"   - {users_collection.name}")
    print(f"   - {courses_collection.name}")
    print(f"   - {tasks_collection.name}")
    
    # Safety confirmation prompt
    confirmation = input("\n👉 Are you sure you want to continue? Type 'yes' to proceed: ")
    
    if confirmation.lower() != 'yes':
        print("\n❌ Aborted. No data was deleted.")
        return

    print("\n🧹 Wiping collections...")
    
    try:
        # Delete all documents from each collection
        users_deleted = users_collection.delete_many({}).deleted_count
        courses_deleted = courses_collection.delete_many({}).deleted_count
        tasks_deleted = tasks_collection.delete_many({}).deleted_count
        
        print("\n--- Deletion Report ---")
        print(f"✅ Users deleted: {users_deleted}")
        print(f"✅ Courses deleted: {courses_deleted}")
        print(f"✅ Tasks deleted: {tasks_deleted}")
        print("\n🎉 Database wipe complete!")

    except Exception as e:
        print(f"\n❌ An error occurred during deletion: {e}")


if __name__ == "__main__":
    wipe_database()

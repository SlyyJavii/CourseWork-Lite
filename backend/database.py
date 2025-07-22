import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()
# Get MongoDB connection string from environment variables
MONGO_URI = os.getenv("MONGO_URI")

# Establish connection to the database
client = MongoClient(MONGO_URI)
db = client.coursework_lite_db # Use or create a database named 'coursework_lite_db'

# Create handles for your collections (like tables in SQL)
users_collection = db.users
courses_collection = db.courses
tasks_collection = db.tasks
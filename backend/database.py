import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()
# Get MongoDB connection string from environment variables
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

# Establish connection to the database
client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

# Create handles for your collections (like tables in SQL)
users_collection = db.users
courses_collection = db.courses
tasks_collection = db.tasks
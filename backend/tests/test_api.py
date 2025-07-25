import pytest
from fastapi.testclient import TestClient
from bson import ObjectId

# Import the main app and database collections
# This assumes your tests are run from the root of the 'backend' directory
from main import app 
from database import users_collection, courses_collection, tasks_collection

# Create a client to make requests to the app
client = TestClient(app)

# --- Centralized Test Data ---
# Define test users in one place for consistency across all tests
USER_A_DATA = {"username": "UserA", "email": "usera@example.com", "password": "passwordA123"}
USER_B_DATA = {"username": "UserB", "email": "userb@example.com", "password": "passwordB456"}


# --- Shared Fixtures ---
# Pytest fixtures are reusable setup/teardown functions for your tests.

@pytest.fixture(scope="session", autouse=True)
def setup_and_teardown_db():
    """
    This fixture runs once per test session. It cleans the database before
    any tests run and after all tests have completed, ensuring a clean state.
    """
    # Cleanup before all tests in the session
    user_emails = [USER_A_DATA["email"], USER_B_DATA["email"]]
    users_collection.delete_many({"email": {"$in": user_emails}})
    # A simple way to clear test data without complex lookups
    courses_collection.delete_many({"courseName": {"$regex": "Test Course"}})
    tasks_collection.delete_many({"title": {"$regex": "Test Task"}})
    
    yield # This is where the entire test session runs
    
    # Cleanup after all tests in the session
    users_collection.delete_many({"email": {"$in": user_emails}})
    courses_collection.delete_many({"courseName": {"$regex": "Test Course"}})
    tasks_collection.delete_many({"title": {"$regex": "Test Task"}})


@pytest.fixture(scope="session")
def auth_headers_user_a():
    """Registers and logs in User A, returning their auth headers."""
    client.post("/users/register", json=USER_A_DATA)
    login_data = {"username": USER_A_DATA["email"], "password": USER_A_DATA["password"]}
    login_response = client.post("/users/login", data=login_data)
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def auth_headers_user_b():
    """Registers and logs in User B, returning their auth headers."""
    client.post("/users/register", json=USER_B_DATA)
    login_data = {"username": USER_B_DATA["email"], "password": USER_B_DATA["password"]}
    login_response = client.post("/users/login", data=login_data)
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def course_for_user_a(auth_headers_user_a):
    """Creates a course for User A and returns its full dictionary object."""
    response = client.post("/courses/", headers=auth_headers_user_a, json={"courseName": "Test Course for Tasks"})
    assert response.status_code == 201
    return response.json()


# --- User Endpoint Tests ---

def test_register_user_duplicate_email(auth_headers_user_a):
    """Tests that registration fails if the email for User A already exists."""
    response = client.post("/users/register", json=USER_A_DATA)
    assert response.status_code == 400

def test_login_user_incorrect_password(auth_headers_user_a):
    """Tests that login fails with an incorrect password."""
    login_data = {"username": USER_A_DATA["email"], "password": "wrongpassword"}
    response = client.post("/users/login", data=login_data)
    assert response.status_code == 401


# --- Course Endpoint Tests ---

def test_create_course_success(auth_headers_user_a):
    """Tests successful course creation."""
    response = client.post("/courses/", headers=auth_headers_user_a, json={"courseName": "Test Software Engineering"})
    assert response.status_code == 201
    assert response.json()["courseName"] == "Test Software Engineering"

def test_get_all_courses(auth_headers_user_a):
    """Tests retrieving all courses for the logged-in user."""
    response = client.get("/courses/", headers=auth_headers_user_a)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_course_unauthorized(auth_headers_user_b, course_for_user_a):
    """SECURITY TEST: Ensures a user cannot update a course they do not own."""
    course_id = course_for_user_a["id"]
    update_data = {"courseName": "Attempted Update"}
    response = client.put(f"/courses/{course_id}", headers=auth_headers_user_b, json=update_data)
    assert response.status_code == 404


# --- Task Endpoint Tests (Linked to Courses) ---

def test_create_task_success(auth_headers_user_a, course_for_user_a):
    """Tests successful task creation within a specific course."""
    task_data = {"title": "Test First Task", "courseId": course_for_user_a["id"]}
    response = client.post("/tasks/", headers=auth_headers_user_a, json=task_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test First Task"
    assert data["courseId"] == course_for_user_a["id"]

def test_create_task_in_another_users_course(auth_headers_user_b, course_for_user_a):
    """SECURITY TEST: Ensures User B cannot create a task in User A's course."""
    task_data = {"title": "Test Malicious Task", "courseId": course_for_user_a["id"]}
    response = client.post("/tasks/", headers=auth_headers_user_b, json=task_data)
    assert response.status_code == 404

def test_get_tasks_filtered_by_course(auth_headers_user_a, course_for_user_a):
    """Tests that filtering tasks by course ID works correctly."""
    client.post("/tasks/", headers=auth_headers_user_a, json={"title": "Test Filter Task", "courseId": course_for_user_a["id"]})
    
    response = client.get(f"/tasks/?course_id={course_for_user_a['id']}", headers=auth_headers_user_a)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0
    for task in tasks:
        assert task["courseId"] == course_for_user_a["id"]

def test_delete_course_cascades_to_tasks(auth_headers_user_a):
    """
    INTEGRATION TEST: Verifies that deleting a course also deletes its tasks.
    """
    course_res = client.post("/courses/", headers=auth_headers_user_a, json={"courseName": "Test Course for Deletion"})
    course_id = course_res.json()["id"]

    task_res = client.post("/tasks/", headers=auth_headers_user_a, json={"title": "Test Task to be Cascaded", "courseId": course_id})
    task_id = task_res.json()["id"]

    delete_res = client.delete(f"/courses/{course_id}", headers=auth_headers_user_a)
    assert delete_res.status_code == 204

    task_get_res = client.get(f"/tasks/{task_id}", headers=auth_headers_user_a)
    assert task_get_res.status_code == 404

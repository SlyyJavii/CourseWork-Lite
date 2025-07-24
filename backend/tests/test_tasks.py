import pytest
from fastapi.testclient import TestClient
from bson import ObjectId

from main import app
from database import tasks_collection, courses_collection, users_collection

client = TestClient(app)

# --- Test Data ---
TEST_USER_A = {"email": "task_user_a@example.com", "password": "password123", "username": "TaskUserA"}
TEST_USER_B = {"email": "task_user_b@example.com", "password": "password456", "username": "TaskUserB"}

# --- Fixtures ---

@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown_db():
    user_emails = [TEST_USER_A["email"], TEST_USER_B["email"]]
    users = list(users_collection.find({"email": {"$in": user_emails}}))
    user_ids = [user["_id"] for user in users]
    users_collection.delete_many({"email": {"$in": user_emails}})
    courses_collection.delete_many({"userId": {"$in": user_ids}})
    tasks_collection.delete_many({"userId": {"$in": user_ids}})
    yield
    users_collection.delete_many({"email": {"$in": user_emails}})
    users = list(users_collection.find({"email": {"$in": user_emails}}))
    user_ids = [user["_id"] for user in users]
    courses_collection.delete_many({"userId": {"$in": user_ids}})
    tasks_collection.delete_many({"userId": {"$in": user_ids}})


@pytest.fixture(scope="module")
def auth_headers_user_a():
    """Registers and logs in User A, returns auth headers."""
    client.post("/users/register", json=TEST_USER_A)
    
    # CORRECTED: Use data= for form submission
    login_data = {"username": TEST_USER_A["email"], "password": TEST_USER_A["password"]}
    login_response = client.post("/users/login", data=login_data)

    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="module")
def auth_headers_user_b():
    """Registers and logs in User B, returns auth headers."""
    client.post("/users/register", json=TEST_USER_B)

    # CORRECTED: Use data= for form submission
    login_data = {"username": TEST_USER_B["email"], "password": TEST_USER_B["password"]}
    login_response = client.post("/users/login", data=login_data)

    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def course_for_user_a(auth_headers_user_a):
    """Creates a course for User A and returns its ID."""
    response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "Test Course for Tasks"})
    return response.json()["id"]

# --- Test Cases ---

def test_create_task_success(auth_headers_user_a, course_for_user_a):
    task_data = {"title": "First Task", "courseId": course_for_user_a}
    response = client.post("/tasks", headers=auth_headers_user_a, json=task_data)
    assert response.status_code == 201
    assert response.json()["title"] == "First Task"
def test_create_task_in_another_users_course(auth_headers_user_b, course_for_user_a):
    task_data = {"title": "Malicious Task", "courseId": course_for_user_a}
    response = client.post("/tasks", headers=auth_headers_user_b, json=task_data)
    assert response.status_code == 404

def test_get_all_tasks_for_user(auth_headers_user_a, course_for_user_a):
    client.post("/tasks", headers=auth_headers_user_a, json={"title": "Task A", "courseId": course_for_user_a})
    response = client.get("/tasks", headers=auth_headers_user_a)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_task_success(auth_headers_user_a, course_for_user_a):
    task_response = client.post("/tasks", headers=auth_headers_user_a, json={"title": "Initial Title", "courseId": course_for_user_a})
    task_id = task_response.json()["id"]
    update_data = {"title": "Updated Title", "status": "complete"}
    response = client.put(f"/tasks/{task_id}", headers=auth_headers_user_a, json=update_data)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"

def test_delete_task_success(auth_headers_user_a, course_for_user_a):
    task_response = client.post("/tasks", headers=auth_headers_user_a, json={"title": "To Be Deleted", "courseId": course_for_user_a})
    task_id = task_response.json()["id"]
    delete_response = client.delete(f"/tasks/{task_id}", headers=auth_headers_user_a)
    assert delete_response.status_code == 204
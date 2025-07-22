# tests/test_courses.py

import pytest
from fastapi.testclient import TestClient
from bson import ObjectId

# Assuming your main FastAPI app instance is in 'main.py'
from main import app
from database import courses_collection, users_collection

# The TestClient allows you to make requests to your FastAPI app in tests
client = TestClient(app)

# --- Test Data ---
# We'll use two separate users to test authorization rules
TEST_USER_A = {"email": "testuserA@example.com", "password": "password123", "username": "UserA"}
TEST_USER_B = {"email": "testuserB@example.com", "password": "password456", "username": "UserB"}

# --- Fixtures ---
# Pytest fixtures are reusable setup functions that run before your tests.

@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown_db():
    """
    This fixture runs once per module. It cleans up the test users and their
    courses from the database before tests run and after they finish.
    """
    # Cleanup before tests
    users_collection.delete_many({"email": {"$in": [TEST_USER_A["email"], TEST_USER_B["email"]]}})
    courses_collection.delete_many({"userId": {"$exists": True}})
    
    yield # This is where the tests will run
    
    # Cleanup after tests
    users_collection.delete_many({"email": {"$in": [TEST_USER_A["email"], TEST_USER_B["email"]]}})
    courses_collection.delete_many({"userId": {"$exists": True}})


@pytest.fixture(scope="module")
def auth_headers_user_a():
    """Creates User A and returns their authentication headers."""
    # Register User A
    client.post("/users/register", json=TEST_USER_A)
    
    # Log in User A to get a token
    login_response = client.post("/users/login", json={"email": TEST_USER_A["email"], "password": TEST_USER_A["password"]})
    token = login_response.json()["access_token"]
    
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def auth_headers_user_b():
    """Creates User B and returns their authentication headers."""
    client.post("/users/register", json=TEST_USER_B)
    login_response = client.post("/users/login", json={"email": TEST_USER_B["email"], "password": TEST_USER_B["password"]})
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# --- Test Cases ---

def test_create_course_success(auth_headers_user_a):
    """
    Tests successful course creation for an authenticated user.
    """
    response = client.post(
        "/courses",
        headers=auth_headers_user_a,
        json={"courseName": "Software Engineering", "courseCode": "CEN4010"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["courseName"] == "Software Engineering"
    assert "id" in data

def test_create_course_unauthorized():
    """
    Tests that creating a course fails without an authentication token.
    """
    response = client.post(
        "/courses",
        json={"courseName": "Unauthorized Course"}
    )
    assert response.status_code == 401

def test_get_all_courses_for_user(auth_headers_user_a):
    """
    Tests retrieving all courses for a specific user.
    """
    # Create a course first to ensure there's something to retrieve
    client.post("/courses", headers=auth_headers_user_a, json={"courseName": "Calculus I"})
    
    response = client.get("/courses", headers=auth_headers_user_a)
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2 # Software Engineering + Calculus I
    assert data[0]["courseName"] == "Software Engineering"

def test_get_single_course_success(auth_headers_user_a):
    """
    Tests retrieving a single course successfully.
    """
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "History 101"})
    course_id = create_response.json()["id"]

    response = client.get(f"/courses/{course_id}", headers=auth_headers_user_a)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == course_id
    assert data["courseName"] == "History 101"

def test_get_single_course_not_found(auth_headers_user_a):
    """
    Tests that a 404 is returned for a course that doesn't exist.
    """
    non_existent_id = str(ObjectId())
    response = client.get(f"/courses/{non_existent_id}", headers=auth_headers_user_a)
    assert response.status_code == 404

def test_get_single_course_invalid_id_format(auth_headers_user_a):
    """
    Tests that a 400 is returned for a malformed course ID.
    """
    response = client.get("/courses/invalid-id-format", headers=auth_headers_user_a)
    assert response.status_code == 400

def test_update_course_success(auth_headers_user_a):
    """
    Tests that a user can successfully update their own course.
    """
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "Original Name"})
    course_id = create_response.json()["id"]
    
    update_payload = {"courseName": "Updated Name", "courseCode": "UPD123"}
    response = client.put(f"/courses/{course_id}", headers=auth_headers_user_a, json=update_payload)

    assert response.status_code == 200
    data = response.json()
    assert data["courseName"] == "Updated Name"
    assert data["courseCode"] == "UPD123"

def test_update_course_unauthorized_access(auth_headers_user_a, auth_headers_user_b):
    """
    Tests that User B cannot update a course belonging to User A.
    """
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "User A Course"})
    course_id = create_response.json()["id"]

    update_payload = {"courseName": "Hacked Name"}
    response = client.put(f"/courses/{course_id}", headers=auth_headers_user_b, json=update_payload)
    assert response.status_code == 404


def test_delete_course_success(auth_headers_user_a):
    """
    Tests that a user can successfully delete their own course.
    """
    create_response = client.post(
        "/courses",
        headers=auth_headers_user_a,
        json={"courseName": "To Be Deleted"}
    )
    course_id = create_response.json()["id"]

    delete_response = client.delete(f"/courses/{course_id}", headers=auth_headers_user_a)
    assert delete_response.status_code == 204

    get_response = client.get(f"/courses/{course_id}", headers=auth_headers_user_a)
    assert get_response.status_code == 404


def test_delete_course_unauthorized_access(auth_headers_user_a, auth_headers_user_b):
    """
    Tests that User B cannot delete a course belonging to User A.
    """
    create_response = client.post(
        "/courses",
        headers=auth_headers_user_a,
        json={"courseName": "User A's Private Course"}
    )
    course_id_user_a = create_response.json()["id"]
    
    delete_response = client.delete(f"/courses/{course_id_user_a}", headers=auth_headers_user_b)
    assert delete_response.status_code == 404

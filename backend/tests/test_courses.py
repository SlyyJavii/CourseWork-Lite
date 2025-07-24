import pytest
from fastapi.testclient import TestClient
from bson import ObjectId

from main import app
from database import courses_collection, users_collection

client = TestClient(app)

# --- Test Data ---
TEST_USER_A = {"email": "testuserA@example.com", "password": "password123", "username": "UserA"}
TEST_USER_B = {"email": "testuserB@example.com", "password": "password456", "username": "UserB"}

# --- Fixtures ---

@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown_db():
    users_collection.delete_many({"email": {"$in": [TEST_USER_A["email"], TEST_USER_B["email"]]}})
    courses_collection.delete_many({"userId": {"$exists": True}})
    yield
    users_collection.delete_many({"email": {"$in": [TEST_USER_A["email"], TEST_USER_B["email"]]}})
    courses_collection.delete_many({"userId": {"$exists": True}})


@pytest.fixture(scope="module")
def auth_headers_user_a():
    """Creates User A and returns their authentication headers."""
    client.post("/users/register", json=TEST_USER_A)
    
    # CORRECTED: Use data= for form submission
    login_data = {"username": TEST_USER_A["email"], "password": TEST_USER_A["password"]}
    login_response = client.post("/users/login", data=login_data)
    
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def auth_headers_user_b():
    """Creates User B and returns their authentication headers."""
    client.post("/users/register", json=TEST_USER_B)

    # CORRECTED: Use data= for form submission
    login_data = {"username": TEST_USER_B["email"], "password": TEST_USER_B["password"]}
    login_response = client.post("/users/login", data=login_data)

    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# --- Test Cases ---

def test_create_course_success(auth_headers_user_a):
    response = client.post(
        "/courses",
        headers=auth_headers_user_a,
        json={"courseName": "Software Engineering", "courseCode": "CEN4010"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["courseName"] == "Software Engineering"
    assert data["courseCode"] == "CEN4010"
    assert "id" in data
    assert ObjectId.is_valid(data["id"])

def test_get_all_courses_for_user(auth_headers_user_a):
    response = client.get("/courses", headers=auth_headers_user_a)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1

def test_get_single_course_success(auth_headers_user_a):
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "History 101"})
    course_id = create_response.json()["id"]
    response = client.get(f"/courses/{course_id}", headers=auth_headers_user_a)
    assert response.status_code == 200
    assert response.json()["courseName"] == "History 101"

def test_update_course_success(auth_headers_user_a):
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "Original Name"})
    course_id = create_response.json()["id"]
    update_payload = {"courseName": "Updated Name", "courseCode": "UPD123"}
    response = client.put(f"/courses/{course_id}", headers=auth_headers_user_a, json=update_payload)
    assert response.status_code == 200
    assert response.json()["courseName"] == "Updated Name"

def test_delete_course_success(auth_headers_user_a):
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "To Be Deleted"})
    course_id = create_response.json()["id"]
    delete_response = client.delete(f"/courses/{course_id}", headers=auth_headers_user_a)
    assert delete_response.status_code == 204

def test_delete_course_unauthorized_access(auth_headers_user_a, auth_headers_user_b):
    create_response = client.post("/courses", headers=auth_headers_user_a, json={"courseName": "User A's Private Course"})
    course_id_user_a = create_response.json()["id"]
    delete_response = client.delete(f"/courses/{course_id_user_a}", headers=auth_headers_user_b)
    assert delete_response.status_code == 404

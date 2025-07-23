# tests/test_users.py

import pytest
from fastapi.testclient import TestClient

# Assuming your main FastAPI app instance is in 'main.py'
from main import app 
from database import users_collection

# The TestClient allows you to make requests to your FastAPI app in tests
client = TestClient(app)

# --- Test Data ---
TEST_USER = {
    "username": "test_user_1",
    "email": "test1@example.com",
    "password": "strongpassword123"
}

# --- Fixtures ---
@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown_db():
    """
    This fixture runs once for this test module. It ensures the test user
    is removed from the database before the tests start and after they finish,
    ensuring a clean state.
    """
    # Cleanup before tests run
    users_collection.delete_one({"email": TEST_USER["email"]})
    
    yield # This is where the tests will run
    
    # Cleanup after tests run
    users_collection.delete_one({"email": TEST_USER["email"]})


# --- Test Cases for User Registration ---

def test_register_user_success():
    """
    Tests successful user registration with valid data.
    """
    response = client.post("/users/register", json=TEST_USER)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == TEST_USER["email"]
    assert data["username"] == TEST_USER["username"]
    assert "password" not in data # Ensure password hash isn't returned

def test_register_user_duplicate_email():
    """
    Tests that registration fails if the email already exists.
    Note: This test depends on the user from test_register_user_success existing.
    """
    response = client.post("/users/register", json=TEST_USER)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_register_user_invalid_email():
    """
    Tests that registration fails with an invalid email format.
    """
    invalid_user = TEST_USER.copy()
    invalid_user["email"] = "not-an-email"
    response = client.post("/users/register", json=invalid_user)
    assert response.status_code == 422 # Unprocessable Entity

def test_register_user_short_password():
    """
    Tests that registration fails if the password is too short.
    """
    invalid_user = TEST_USER.copy()
    invalid_user["password"] = "short"
    response = client.post("/users/register", json=invalid_user)
    assert response.status_code == 422


# --- Test Cases for User Login ---

def test_login_user_success():
    """
    Tests successful user login with correct credentials.
    This test is updated to match your LoginResponse model.
    """
    response = client.post(
        "/users/login",
        json={"email": TEST_USER["email"], "password": TEST_USER["password"]}
    )
    assert response.status_code == 202
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert data["access_token"] is not None

def test_login_user_incorrect_password():
    """
    Tests that login fails with an incorrect password.
    """
    response = client.post(
        "/users/login",
        json={"email": TEST_USER["email"], "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_login_user_nonexistent_email():
    """
    Tests that login fails for an email that is not registered.
    """
    response = client.post(
        "/users/login",
        json={"email": "nosuchuser@example.com", "password": "password123"}
    )
    assert response.status_code == 401

# Note: The tests for the /users/me endpoint have been removed as it is not
# implemented in your current users.py file. You can add them back if you
# decide to create a protected endpoint to fetch the current user's profile.

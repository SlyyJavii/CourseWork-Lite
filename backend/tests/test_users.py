import pytest
from fastapi.testclient import TestClient

from main import app 
from database import users_collection

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
    users_collection.delete_one({"email": TEST_USER["email"]})
    yield
    users_collection.delete_one({"email": TEST_USER["email"]})

@pytest.fixture(scope="module")
def register_test_user():
    """A fixture to ensure the test user is registered before login tests run."""
    client.post("/users/register", json=TEST_USER)

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

# --- Test Cases for User Login ---

def test_login_user_success(register_test_user):
    """
    Tests successful user login with correct credentials using form data.
    """
    login_data = {"username": TEST_USER["email"], "password": TEST_USER["password"]}
    response = client.post("/users/login", data=login_data)
    
    assert response.status_code == 202
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_user_incorrect_password(register_test_user):
    """
    Tests that login fails with an incorrect password.
    """
    login_data = {"username": TEST_USER["email"], "password": "wrongpassword"}
    response = client.post("/users/login", data=login_data)
    assert response.status_code == 401

def test_login_user_nonexistent_email():
    """
    Tests that login fails for an email that is not registered.
    """
    login_data = {"username": "nosuchuser@example.com", "password": "password123"}
    response = client.post("/users/login", data=login_data)
    assert response.status_code == 401
"""
GANITA PRAKASH - Backend API Test Cases
Comprehensive test suite for all API endpoints
"""

import pytest
import httpx
from datetime import datetime

# API Base URL
API_URL = "https://app-zmatwbmr.fly.dev"

# Test user credentials - unique per test run
TEST_USER_EMAIL = f"testuser_{int(datetime.now().timestamp())}@test.com"
TEST_USER = {
    "username": TEST_USER_EMAIL,
    "password": "TestPassword123!",
    "name": "Test User",
    "platform": "web"
}

# Admin credentials
ADMIN_USER = {
    "username": "cbseailearnersmathematics@gmail.com",
    "password": "Mathematics@123",
    "platform": "web"
}


def get_admin_token():
    """Helper function to get admin authentication token, returns None if login fails"""
    response = httpx.post(f"{API_URL}/api/auth/login", json=ADMIN_USER)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None


def get_test_user_token():
    """Helper function to get test user token by registering"""
    test_user = {
        "username": f"testuser_{int(datetime.now().timestamp())}@test.com",
        "password": "TestPassword123!",
        "name": "Test User",
        "platform": "web"
    }
    response = httpx.post(f"{API_URL}/api/auth/register", json=test_user)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """TC-001: Verify API health check returns OK"""
        response = httpx.get(f"{API_URL}/healthz")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"


class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_register_new_user(self):
        """TC-002: Verify new user registration"""
        new_user = {
            "username": f"newuser_{int(datetime.now().timestamp())}@test.com",
            "password": "TestPassword123!",
            "name": "New Test User",
            "platform": "web"
        }
        response = httpx.post(f"{API_URL}/api/auth/register", json=new_user)
        assert response.status_code in [200, 201]
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
    
    def test_register_duplicate_user(self):
        """TC-003: Verify duplicate registration is rejected"""
        dup_user = {
            "username": f"dupuser_{int(datetime.now().timestamp())}@test.com",
            "password": "TestPassword123!",
            "name": "Dup User",
            "platform": "web"
        }
        # First registration
        httpx.post(f"{API_URL}/api/auth/register", json=dup_user)
        # Second registration with same email
        response = httpx.post(f"{API_URL}/api/auth/register", json=dup_user)
        assert response.status_code == 400
    
    def test_login_valid_credentials(self):
        """TC-004: Verify login with valid credentials"""
        # Register first
        login_user = {
            "username": f"loginuser_{int(datetime.now().timestamp())}@test.com",
            "password": "TestPassword123!",
            "name": "Login User",
            "platform": "web"
        }
        httpx.post(f"{API_URL}/api/auth/register", json=login_user)
        # Login
        login_data = {
            "username": login_user["username"],
            "password": login_user["password"],
            "platform": "web"
        }
        response = httpx.post(f"{API_URL}/api/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
    
    def test_login_invalid_password(self):
        """TC-005: Verify login with invalid password fails"""
        login_data = {
            "username": "someuser@test.com",
            "password": "WrongPassword123!",
            "platform": "web"
        }
        response = httpx.post(f"{API_URL}/api/auth/login", json=login_data)
        assert response.status_code in [401, 400]
    
    def test_login_nonexistent_user(self):
        """TC-006: Verify login with nonexistent user fails"""
        login_data = {
            "username": f"nonexistent_{int(datetime.now().timestamp())}@test.com",
            "password": "SomePassword123!",
            "platform": "web"
        }
        response = httpx.post(f"{API_URL}/api/auth/login", json=login_data)
        assert response.status_code in [401, 400, 404]
    
    def test_admin_login(self):
        """TC-007: Verify admin login works (requires admin account to exist)"""
        response = httpx.post(f"{API_URL}/api/auth/login", json=ADMIN_USER)
        if response.status_code == 200:
            data = response.json()
            assert "access_token" in data
            assert data["user"]["is_admin"] == True
        else:
            pytest.skip("Admin account not yet created in database")


class TestUserProfile:
    """Test user profile endpoints"""
    
    def test_get_current_user(self):
        """TC-008: Verify get current user profile"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "username" in data
        assert "name" in data
    
    def test_get_user_without_token(self):
        """TC-009: Verify unauthorized access is rejected"""
        response = httpx.get(f"{API_URL}/api/auth/me")
        assert response.status_code in [401, 403]


class TestProgress:
    """Test progress tracking endpoints"""
    
    def test_get_progress(self):
        """TC-010: Verify get user progress"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/progress", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_update_progress(self):
        """TC-011: Verify update chapter progress"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        progress_data = {
            "chapter_id": 1,
            "score": 80,
            "completed": True,
            "unlocked": True
        }
        response = httpx.post(f"{API_URL}/api/progress", json=progress_data, headers=headers)
        assert response.status_code == 200


class TestCertificates:
    """Test certificate endpoints"""
    
    def test_get_certificates(self):
        """TC-012: Verify get user certificates"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/certificates", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_certificate(self):
        """TC-013: Verify create certificate"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        cert_data = {
            "chapter_id": 1,
            "score": 85,
            "certificate_type": "chapter"
        }
        response = httpx.post(f"{API_URL}/api/certificates", json=cert_data, headers=headers)
        assert response.status_code in [200, 201]


class TestMessages:
    """Test messaging endpoints"""
    
    def test_get_messages(self):
        """TC-014: Verify get messages"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/messages", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_send_message(self):
        """TC-015: Verify send message"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        message_data = {
            "content": "Test message from automated test",
            "message_type": "text"
        }
        response = httpx.post(f"{API_URL}/api/messages", json=message_data, headers=headers)
        assert response.status_code in [200, 201]


class TestAIAssistant:
    """Test AI Assistant endpoints"""
    
    def test_ai_chat(self):
        """TC-016: Verify AI chat endpoint"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        chat_data = {
            "message": "What is 2 + 2?",
            "chapter_id": 1
        }
        response = httpx.post(f"{API_URL}/api/ai/chat", json=chat_data, headers=headers, timeout=30.0)
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
    
    def test_ai_chat_empty_message(self):
        """TC-017: Verify AI chat handles empty message"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        chat_data = {
            "message": "",
            "chapter_id": 1
        }
        response = httpx.post(f"{API_URL}/api/ai/chat", json=chat_data, headers=headers)
        # Should either return error or handle gracefully
        assert response.status_code in [200, 400, 422]


class TestAdminDashboard:
    """Test admin dashboard endpoints"""
    
    def test_admin_dashboard(self):
        """TC-018: Verify admin dashboard access"""
        token = get_admin_token()
        if not token:
            pytest.skip("Admin account not available")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/admin/dashboard", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "users" in data
    
    def test_admin_dashboard_unauthorized(self):
        """TC-019: Verify non-admin cannot access dashboard"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get test user token")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/admin/dashboard", headers=headers)
        assert response.status_code in [401, 403]
    
    def test_admin_action_unlock_all(self):
        """TC-020: Verify admin can unlock all chapters for user"""
        token = get_admin_token()
        if not token:
            pytest.skip("Admin account not available")
        headers = {"Authorization": f"Bearer {token}"}
        action_data = {
            "user_id": 1,
            "action": "unlock_all"
        }
        response = httpx.post(f"{API_URL}/api/admin/action", json=action_data, headers=headers)
        assert response.status_code == 200


class TestNotifications:
    """Test notification endpoints"""
    
    def test_get_notifications(self):
        """TC-021: Verify get notifications"""
        token = get_test_user_token()
        if not token:
            pytest.skip("Could not get auth token")
        headers = {"Authorization": f"Bearer {token}"}
        response = httpx.get(f"{API_URL}/api/notifications", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestChapterModels:
    """Test 3D model endpoints"""
    
    def test_get_chapter_models(self):
        """TC-022: Verify get chapter 3D models"""
        response = httpx.get(f"{API_URL}/api/models/1")
        assert response.status_code == 200
        data = response.json()
        assert "chapter_id" in data
        assert "models" in data
        assert isinstance(data["models"], list)


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

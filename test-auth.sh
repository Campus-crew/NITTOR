#!/bin/bash

echo "🧪 Testing Auth Endpoints..."
echo ""

API_URL="http://20.170.114.8:8000"

echo "1️⃣ Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "username": "testuser'$(date +%s)'",
    "password": "testpass123",
    "full_name": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

echo "2️⃣ Testing Login (should fail with wrong credentials)..."
LOGIN_FAIL=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=wrong@email.com&password=wrongpass")

echo "Response: $LOGIN_FAIL"
echo ""

echo "3️⃣ Testing Google OAuth URL..."
GOOGLE_URL=$(curl -s -X GET "$API_URL/auth/google/login")

echo "Response: $GOOGLE_URL"
echo ""

echo "✅ All endpoint tests completed!"
echo ""
echo "📝 To test login with valid credentials:"
echo "   1. Register a user via /signup page"
echo "   2. Then login with those credentials via /login page"

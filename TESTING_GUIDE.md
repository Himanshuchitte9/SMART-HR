# SmartHR Manual Testing Guide

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`

## Test 1: User Registration

### Steps:
1. Open browser and navigate to: `http://localhost:5173`
2. You should see the Login page
3. Click on "Register" link at the bottom
4. Fill in the registration form:
   - **Name**: Test Owner
   - **Email**: testowner@smarthr.com
   - **Mobile**: 9876543210
   - **Password**: password123
   - **Gender**: Male (default)
   - **Purpose**: Select "Owner"
   - Leave other fields empty or default
5. Click "Register" button

### Expected Result:
- ✅ You should be redirected to the Dashboard
- ✅ Dashboard should show "Welcome, Test Owner!"
- ✅ Sidebar should show role badge "OWNER"
- ✅ Dashboard should show stat cards

### If Registration Fails:
- Check browser console (F12) for errors
- Check backend terminal for error logs
- Verify backend is running on port 5000

---

## Test 2: User Login

### Steps:
1. If logged in, click "Logout" button in sidebar
2. You should be redirected to Login page
3. Enter credentials:
   - **Email**: testowner@smarthr.com
   - **Password**: password123
4. Click "Login" button

### Expected Result:
- ✅ Redirected to Dashboard
- ✅ User data displayed correctly

---

## Test 3: Create Institute (Owner Only)

### Steps:
1. Login as Owner
2. On Dashboard, click "Get Started" button in "Create Institute" card
3. (Note: This feature needs to be implemented in a modal or separate page)

### Current Status:
⚠️ Institute creation UI needs to be added (backend API is ready)

---

## Test 4: API Testing with Postman/Thunder Client

### Register User:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "apitest@smarthr.com",
  "mobile": "9999999999",
  "password": "test123",
  "purpose": "OWNER"
}
```

### Login:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "apitest@smarthr.com",
  "password": "test123"
}
```
Copy the `token` from response.

### Create Institute:
```
POST http://localhost:5000/api/institutes
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "name": "Test School",
  "type": "school",
  "address": "123 Test Street"
}
```

### Create Role:
```
POST http://localhost:5000/api/roles
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "institute_id": "INSTITUTE_ID_FROM_PREVIOUS_RESPONSE",
  "name": "Principal"
}
```

### Get Role Tree:
```
GET http://localhost:5000/api/roles/INSTITUTE_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Troubleshooting

### Frontend not loading:
```bash
cd frontend
npm run dev
```

### Backend not responding:
```bash
cd backend
npm start
```

### Database connection errors:
- Check MongoDB is running: `mongod --version`
- Or set up PostgreSQL (see POSTGRESQL_SETUP.md)

### CORS errors:
- Backend already has CORS enabled
- Make sure backend is running on port 5000

---

## Quick Verification Checklist

- [ ] Frontend loads at http://localhost:5173
- [ ] Can navigate to Register page
- [ ] Can register a new user
- [ ] Redirected to Dashboard after registration
- [ ] Can logout
- [ ] Can login with registered credentials
- [ ] Dashboard shows user information
- [ ] Sidebar shows correct role badge

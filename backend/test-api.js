import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('🧪 Starting API Tests...\n');

// Test 1: Backend Health Check
async function testBackendHealth() {
    console.log('1️⃣ Testing Backend Health...');
    try {
        const response = await axios.get(`${API_URL}/health`);
        console.log('✅ Backend is running');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Backend health check failed');
        console.log('Error:', error.message);
    }
    console.log('');
}

// Test 2: Login with Super Admin
async function testLogin() {
    console.log('2️⃣ Testing Login...');
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@smarthr.com',
            password: 'Admin@123'
        });
        console.log('✅ Login successful!');
        console.log('Token:', response.data.token?.substring(0, 20) + '...');
        console.log('User:', response.data.user?.name);
        return response.data.token;
    } catch (error) {
        console.log('❌ Login failed');
        console.log('Error:', error.response?.data || error.message);
    }
    console.log('');
}

// Test 3: Register New User
async function testRegister() {
    console.log('3️⃣ Testing Registration...');
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            mobile: `98765${Math.floor(Math.random() * 10000)}`,
            password: 'Test@123',
            gender: 'MALE',
            address: 'Test Address',
            qualification: 'B.Tech',
            experience_years: 2,
            purpose: 'EMPLOYEE'
        });
        console.log('✅ Registration successful!');
        console.log('User:', response.data.user?.name);
    } catch (error) {
        console.log('❌ Registration failed');
        console.log('Error:', error.response?.data || error.message);
    }
    console.log('');
}

// Test 4: Protected Route (Get Profile)
async function testProtectedRoute(token) {
    console.log('4️⃣ Testing Protected Route...');
    if (!token) {
        console.log('⚠️  Skipping - No token available');
        console.log('');
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Protected route working!');
        console.log('User:', response.data.name);
    } catch (error) {
        console.log('❌ Protected route failed');
        console.log('Error:', error.response?.data || error.message);
    }
    console.log('');
}

// Run all tests
async function runTests() {
    await testBackendHealth();
    const token = await testLogin();
    await testRegister();
    await testProtectedRoute(token);

    console.log('✅ API Testing Complete!\n');
}

runTests().catch(console.error);

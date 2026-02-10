import fetch from 'node-fetch';

async function testLogin() {
    try {
        console.log('🧪 Testing Login API...\n');

        const loginData = {
            email: 'vaibhavmishra@gmail.com',
            password: 'Admin@123'
        };

        console.log('Sending login request to: http://localhost:5000/api/auth/login');
        console.log('Email:', loginData.email);
        console.log('Password:', loginData.password);
        console.log('');

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        console.log('Response Status:', response.status, response.statusText);

        const data = await response.json();
        console.log('\nResponse Data:');
        console.log(JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Login successful!');
            console.log('Role:', data.role);
            console.log('Token:', data.token ? 'Generated ✅' : 'Missing ❌');
        } else {
            console.log('\n❌ Login failed!');
            console.log('Error:', data.message);
        }

    } catch (error) {
        console.error('\n❌ Error testing login:');
        console.error('Message:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Server is not running!');
            console.error('Please start the backend server first with: npm start');
        }
    }
}

testLogin();

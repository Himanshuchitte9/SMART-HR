import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:5000/api';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('backend_verify.log', msg + '\n');
};

const runTests = async () => {
    fs.writeFileSync('backend_verify.log', '🚀 Starting Backend Verification...\n');
    log('🚀 Starting Backend Verification...');

    // 1. Register Owner
    log('\n📝 Testing Registration...');
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const ownerData = {
        name: 'John Doe',
        email: `owner_${Date.now()}_${randomSuffix}@test.com`,
        mobile: `98${Math.floor(Math.random() * 100000000)}`, // 10 digits total attempt
        password: 'password123',
        purpose: 'OWNER'
    };

    let ownerToken = '';
    let ownerId = '';

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ownerData)
        });
        const data = await res.json();

        if (res.ok) {
            log(`✅ Registration Successful: ${data.email}`);
            ownerToken = data.token;
            ownerId = data._id;
        } else {
            log(`❌ Registration Failed: ${JSON.stringify(data, null, 2)}`);
            return;
        }
    } catch (err) {
        log(`❌ Network Error: ${err.message}`);
        return;
    }

    // 2. Login
    log('\n🔑 Testing Login...');
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ownerData.email, password: ownerData.password })
        });
        const data = await res.json();
        if (res.ok) {
            log('✅ Login Successful');
        } else {
            log(`❌ Login Failed: ${data.message}`);
        }
    } catch (err) { log(err); }

    // 3. Create Institute
    log('\n🏢 Testing Institute Creation...');
    let instituteId = '';
    try {
        const res = await fetch(`${API_URL}/institutes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ownerToken}`
            },
            body: JSON.stringify({
                name: 'Smart Global School',
                type: 'school',
                address: '123 Education Lane'
            })
        });
        const data = await res.json();
        if (res.ok) {
            log(`✅ Institute Created: ${data.name}`);
            instituteId = data.id || data._id;
        } else {
            log(`❌ Institute Creation Failed: ${data.message}`);
            return;
        }
    } catch (err) { log(err); }

    // 4. Create Roles (Hierarchy)
    log('\n🌳 Testing Role Hierarchy...');
    let principalId, vicePrincipalId;

    // Create Principal (Top Level)
    try {
        const res = await fetch(`${API_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ownerToken}`
            },
            body: JSON.stringify({
                institute_id: instituteId,
                name: 'Principal'
            })
        });
        const data = await res.json();
        if (res.ok) {
            log('✅ Role Created: Principal');
            principalId = data.id || data._id;
        } else {
            log(`❌ Role Principal Failed: ${data.message}`);
        }
    } catch (err) { log(err); }

    // Create Vice Principal (Under Principal)
    if (principalId) {
        try {
            const res = await fetch(`${API_URL}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ownerToken}`
                },
                body: JSON.stringify({
                    institute_id: instituteId,
                    name: 'Vice Principal',
                    parent_role_id: principalId
                })
            });
            const data = await res.json();
            if (res.ok) {
                log('✅ Role Created: Vice Principal');
                vicePrincipalId = data.id || data._id;
            } else {
                log(`❌ Role VP Failed: ${data.message}`);
            }
        } catch (err) { log(err); }
    }

    // 5. Get Role Tree
    log('\n👀 Testing Role Tree Fetch...');
    try {
        const res = await fetch(`${API_URL}/roles/${instituteId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ownerToken}`
            }
        });
        const data = await res.json();
        if (res.ok) {
            log(`✅ Role Tree Fetched: ${JSON.stringify(data, null, 2)}`);
            if (data.length > 0 && data[0].children) {
                log('✅ Tree Structure Verified');
            } else {
                log('⚠️ Tree Structure ambiguous');
            }
        } else {
            log(`❌ Fetch Tree Failed: ${data.message}`);
        }
    } catch (err) { log(err); }

    log('\n🏁 Verification Complete');
};

runTests();

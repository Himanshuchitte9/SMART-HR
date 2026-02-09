const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarthr_db';

const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    gender: String,
    address: String,
    qualification: String,
    experience_years: Number,
    purpose: String,
    status: { type: String, default: 'ACTIVE' },
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkAndFixAdmin() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const email = 'admin@smarthr.com';

        // Check if admin exists
        const admin = await User.findOne({ email });

        if (admin) {
            console.log('✅ Admin found in database!');
            console.log('ID:', admin._id);
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Purpose:', admin.purpose);

            // Test password
            const isMatch = await bcrypt.compare('Admin@123', admin.password);
            console.log('\n🔐 Password Test:', isMatch ? '✅ CORRECT' : '❌ WRONG');

            if (!isMatch) {
                console.log('\n⚠️  Password mismatch! Fixing...');
                const hashedPassword = await bcrypt.hash('Admin@123', 10);
                admin.password = hashedPassword;
                await admin.save();
                console.log('✅ Password updated!');
            }
        } else {
            console.log('❌ Admin NOT found! Creating...\n');

            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            const newAdmin = new User({
                _id: 'super-admin-001',
                name: 'Super Admin',
                email: email,
                mobile: '9999999999',
                password: hashedPassword,
                gender: 'MALE',
                address: 'System',
                qualification: 'Administrator',
                experience_years: 10,
                purpose: 'SUPERADMIN',
                status: 'ACTIVE'
            });

            await newAdmin.save();
            console.log('✅ Super Admin created!');
        }

        console.log('\n📧 Login Credentials:');
        console.log('Email: admin@smarthr.com');
        console.log('Password: Admin@123');

        await mongoose.connection.close();
        console.log('\n✅ Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAndFixAdmin();

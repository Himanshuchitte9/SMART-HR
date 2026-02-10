import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

async function debugLogin() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check all users with SUPERADMIN purpose
        console.log('🔍 Searching for all SUPERADMIN users...\n');
        const superAdmins = await User.find({ purpose: 'SUPERADMIN' });

        console.log(`Found ${superAdmins.length} SUPERADMIN user(s):\n`);

        for (const admin of superAdmins) {
            console.log('─────────────────────────────────');
            console.log('ID:', admin._id);
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Mobile:', admin.mobile);
            console.log('Purpose:', admin.purpose);
            console.log('Status:', admin.status);
            console.log('Password Hash:', admin.password.substring(0, 20) + '...');

            // Test password
            const testPassword = 'Admin@123';
            const isMatch = await bcrypt.compare(testPassword, admin.password);
            console.log(`Password "${testPassword}" matches:`, isMatch ? '✅ YES' : '❌ NO');
            console.log('─────────────────────────────────\n');
        }

        // Also check for the specific email
        console.log('🔍 Checking for vaibhavmishra@gmail.com specifically...\n');
        const specificUser = await User.findOne({ email: 'vaibhavmishra@gmail.com' });

        if (specificUser) {
            console.log('✅ User found with email vaibhavmishra@gmail.com');
            console.log('Purpose:', specificUser.purpose);
            const isMatch = await bcrypt.compare('Admin@123', specificUser.password);
            console.log('Password matches:', isMatch ? '✅ YES' : '❌ NO');
        } else {
            console.log('❌ No user found with email vaibhavmishra@gmail.com');
        }

        // Check for old admin email
        console.log('\n🔍 Checking for old admin email (admin@smarthr.com)...\n');
        const oldAdmin = await User.findOne({ email: 'admin@smarthr.com' });

        if (oldAdmin) {
            console.log('⚠️  Old admin still exists!');
            console.log('Email:', oldAdmin.email);
            console.log('Purpose:', oldAdmin.purpose);
        } else {
            console.log('✅ Old admin email not found (good)');
        }

        await mongoose.connection.close();
        console.log('\n✅ Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

debugLogin();

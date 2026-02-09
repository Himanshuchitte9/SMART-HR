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

async function createSuperAdmin() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const email = 'admin@smarthr.com';

        // Check if super admin already exists
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('⚠️  Super Admin already exists!');
            console.log('Email:', email);
            console.log('You can login with: admin@smarthr.com / Admin@123');
            await mongoose.connection.close();
            return;
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const superAdmin = new User({
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

        await superAdmin.save();

        console.log('✅ Super Admin created successfully!');
        console.log('');
        console.log('📧 Email: admin@smarthr.com');
        console.log('🔑 Password: Admin@123');
        console.log('');
        console.log('You can now login at http://localhost:3000');

        await mongoose.connection.close();
        console.log('✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createSuperAdmin();

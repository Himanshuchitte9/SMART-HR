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

async function updateSuperAdmin() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // New credentials
        const newEmail = 'vaibhavmishra@gmail.com';
        const newPassword = 'Admin@123';

        // Find existing superadmin by purpose
        const existingAdmin = await User.findOne({ purpose: 'SUPERADMIN' });

        if (existingAdmin) {
            console.log('✅ Found existing Super Admin');
            console.log('Current Email:', existingAdmin.email);

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the credentials
            existingAdmin.email = newEmail;
            existingAdmin.password = hashedPassword;
            existingAdmin.name = 'Vaibhav Mishra';

            await existingAdmin.save();

            console.log('\n✅ Super Admin credentials updated successfully!');
        } else {
            console.log('❌ No existing Super Admin found. Creating new one...\n');

            // Create new super admin
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const superAdmin = new User({
                _id: 'super-admin-001',
                name: 'Vaibhav Mishra',
                email: newEmail,
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
            console.log('✅ New Super Admin created successfully!');
        }

        console.log('\n📧 New Login Credentials:');
        console.log('Email:', newEmail);
        console.log('Password:', newPassword);
        console.log('\nYou can now login at http://localhost:3000');

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 11000) {
            console.error('⚠️  Email already exists in database. Trying alternative approach...');

            // If email conflict, delete old admin and create new one
            try {
                await User.deleteOne({ email: 'admin@smarthr.com' });
                console.log('Deleted old admin account');

                const hashedPassword = await bcrypt.hash('Admin@123', 10);
                const superAdmin = new User({
                    _id: 'super-admin-001',
                    name: 'Vaibhav Mishra',
                    email: 'vaibhavmishra@gmail.com',
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
                console.log('✅ New Super Admin created!');
            } catch (retryError) {
                console.error('❌ Retry failed:', retryError.message);
            }
        }
        await mongoose.connection.close();
        process.exit(1);
    }
}

updateSuperAdmin();

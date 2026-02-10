import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

const PG_CONFIG = {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DB || 'smarthr',
    password: process.env.PG_PASSWORD || 'password',
    port: process.env.PG_PORT || 5432,
};

async function createSuperAdminPG() {
    const pool = new Pool(PG_CONFIG);

    try {
        console.log('🔗 Connecting to PostgreSQL...');
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL\n');

        const email = 'vaibhavmishra@gmail.com';
        const password = 'Admin@123';
        const name = 'Vaibhav Mishra';

        // Check if superadmin already exists
        console.log('🔍 Checking for existing superadmin...');
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            console.log('⚠️  User with this email already exists!');
            console.log('Existing user:', checkResult.rows[0]);

            // Update the existing user
            console.log('\n🔄 Updating existing user to SUPERADMIN...');
            const hashedPassword = await bcrypt.hash(password, 10);

            const updateQuery = `
                UPDATE users 
                SET password = $1, purpose = $2, name = $3, status = $4
                WHERE email = $5
                RETURNING *
            `;
            const updateResult = await pool.query(updateQuery, [
                hashedPassword,
                'SUPERADMIN',
                name,
                'ACTIVE',
                email
            ]);

            console.log('✅ User updated successfully!');
            console.log('Updated user:', updateResult.rows[0]);
        } else {
            // Create new superadmin
            console.log('📝 Creating new superadmin...');
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = uuidv4();

            const insertQuery = `
                INSERT INTO users (
                    id, name, email, mobile, password, gender, 
                    address, qualification, experience_years, purpose, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `;

            const insertResult = await pool.query(insertQuery, [
                userId,
                name,
                email,
                '9999999999',
                hashedPassword,
                'MALE',
                'System',
                'Administrator',
                10,
                'SUPERADMIN',
                'ACTIVE'
            ]);

            console.log('✅ Superadmin created successfully!');
            console.log('New user:', insertResult.rows[0]);
        }

        // Verify the password
        console.log('\n🔐 Verifying password...');
        const verifyQuery = 'SELECT * FROM users WHERE email = $1';
        const verifyResult = await pool.query(verifyQuery, [email]);

        if (verifyResult.rows.length > 0) {
            const user = verifyResult.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log('✅ Password verification successful!');
            } else {
                console.log('❌ Password verification failed!');
            }
        }

        console.log('\n📧 Login Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('\nYou can now login at http://localhost:3000');

        await pool.end();
        console.log('\n✅ Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        await pool.end();
        process.exit(1);
    }
}

createSuperAdminPG();

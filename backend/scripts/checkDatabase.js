import { connectDB, getDBType } from '../config/db.js';

async function checkDatabaseConnection() {
    try {
        console.log('🔍 Checking which database the server is using...\n');

        const dbType = await connectDB();

        console.log('✅ Database connected!');
        console.log('Database Type:', dbType);
        console.log('Current DB Type:', getDBType());

        if (dbType === 'PG') {
            console.log('\n⚠️  Server is using PostgreSQL!');
            console.log('The superadmin was created in MongoDB.');
            console.log('You need to either:');
            console.log('1. Create superadmin in PostgreSQL, OR');
            console.log('2. Disable PostgreSQL to force MongoDB usage');
        } else if (dbType === 'MONGO') {
            console.log('\n✅ Server is using MongoDB!');
            console.log('The superadmin should work.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkDatabaseConnection();

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD
});

async function initializeDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔗 Connected to PostgreSQL');
        console.log(`📊 Database: ${process.env.PG_DB}`);
        console.log(`👤 User: ${process.env.PG_USER}`);

        // Test connection
        const result = await client.query('SELECT NOW()');
        console.log('✅ Connection successful:', result.rows[0].now);

        console.log('\n🚀 Initializing database schema...\n');

        // Read and execute SQL file
        const sqlPath = path.join(__dirname, 'init_postgres.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);

        console.log('✅ Database schema initialized successfully!');
        console.log('\n📋 Tables created:');

        // List all tables
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        tables.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.table_name}`);
        });

        console.log('\n✅ Database initialization complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

initializeDatabase()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

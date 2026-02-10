import pg from 'pg';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pgPool = null;
let isPgConnected = false;
let isMongoConnected = false;

// Configuration
const PG_CONFIG = {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DB || 'SMARTHR',
    password: process.env.PG_PASSWORD || 'VAIBHAV@22',
    port: process.env.PG_PORT || 5432,
};

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarthr';

// Connect Function
const connectDB = async () => {
    // 1. Try PostgreSQL
    try {
        console.log('Attempting to connect to PostgreSQL...');
        pgPool = new Pool(PG_CONFIG);
        await pgPool.query('SELECT NOW()'); // Test connection
        isPgConnected = true;
        console.log('✅ Connected to PostgreSQL');
        return 'PG';
    } catch (err) {
        console.error('❌ PostgreSQL Connection Failed:', err.message);
        console.log('⚠️ Falling back to MongoDB...');
    }

    // 2. Fallback to MongoDB
    try {
        await mongoose.connect(MONGO_URI);
        isMongoConnected = true;
        console.log('✅ Connected to MongoDB');
        return 'MONGO';
    } catch (err) {
        console.error('❌ MongoDB Connection Failed:', err.message);
        console.error('❌ Both databases failed to connect. Exiting...');
        process.exit(1);
    }
};

// Generic Query Helper (The Abstraction Layer)
const query = async (text, params) => {
    if (isPgConnected) {
        return pgPool.query(text, params);
    } else if (isMongoConnected) {
        throw new Error("Direct SQL query called but connected to MongoDB. Use Model methods instead.");
    } else {
        throw new Error("Database not connected");
    }
};

const getDBType = () => {
    if (isPgConnected) return 'PG';
    if (isMongoConnected) return 'MONGO';
    return 'NONE';
};

export { connectDB, query, getDBType, pgPool, mongoose };

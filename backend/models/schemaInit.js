import { query, getDBType } from '../config/db.js';

const initPGScreens = async () => {
    if (getDBType() !== 'PG') return;

    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            mobile VARCHAR(15) UNIQUE,
            password VARCHAR(255),
            gender VARCHAR(10),
            address TEXT,
            qualification TEXT,
            experience_years INT,
            purpose VARCHAR(20),
            status VARCHAR(20) DEFAULT 'ACTIVE',
            created_at TIMESTAMP DEFAULT now()
        );`,
        `CREATE TABLE IF NOT EXISTS institutes (
            id UUID PRIMARY KEY,
            name VARCHAR(150),
            type VARCHAR(50),
            address TEXT,
            owner_id UUID REFERENCES users(id),
            status VARCHAR(20) DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT now()
        );`,
        `CREATE TABLE IF NOT EXISTS roles (
            id UUID PRIMARY KEY,
            institute_id UUID REFERENCES institutes(id),
            name VARCHAR(100),
            parent_role_id UUID REFERENCES roles(id),
            level INT,
            created_at TIMESTAMP DEFAULT now()
        );`,
        `CREATE TABLE IF NOT EXISTS permissions (
            id UUID PRIMARY KEY,
            key VARCHAR(100) UNIQUE,
            description TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS role_permissions (
            role_id UUID REFERENCES roles(id),
            permission_id UUID REFERENCES permissions(id),
            PRIMARYKEY(role_id, permission_id)
        );`,
        `CREATE TABLE IF NOT EXISTS employment_map (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            institute_id UUID REFERENCES institutes(id),
            role_id UUID REFERENCES roles(id),
            manager_id UUID REFERENCES users(id),
            work_type VARCHAR(20),
            status VARCHAR(20),
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP DEFAULT now()
        );`
    ];

    try {
        for (const q of queries) {
            await query(q);
        }
        console.log('✅ PostgreSQL Tables Initialized');
    } catch (err) {
        console.error('❌ Error initializing PG tables:', err);
    }
};

export default initPGScreens;

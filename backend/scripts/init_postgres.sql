-- SmartHR PostgreSQL Database Setup
-- Run this script after creating the database
-- Create users table
CREATE TABLE IF NOT EXISTS users (
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
);
-- Create institutes table
CREATE TABLE IF NOT EXISTS institutes (
    id UUID PRIMARY KEY,
    name VARCHAR(150),
    type VARCHAR(50),
    address TEXT,
    owner_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT now()
);
-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY,
    institute_id UUID REFERENCES institutes(id),
    name VARCHAR(100),
    parent_role_id UUID REFERENCES roles(id),
    level INT,
    created_at TIMESTAMP DEFAULT now()
);
-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY,
    key VARCHAR(100) UNIQUE,
    description TEXT
);
-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY(role_id, permission_id)
);
-- Create employment_map table
CREATE TABLE IF NOT EXISTS employment_map (
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
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_institutes_owner ON institutes(owner_id);
CREATE INDEX IF NOT EXISTS idx_roles_institute ON roles(institute_id);
CREATE INDEX IF NOT EXISTS idx_employment_user ON employment_map(user_id);
CREATE INDEX IF NOT EXISTS idx_employment_institute ON employment_map(institute_id);
-- Insert some default permissions (optional)
INSERT INTO permissions (id, key, description)
VALUES (
        gen_random_uuid(),
        'ADD_EMPLOYEE',
        'Permission to add employees'
    ),
    (
        gen_random_uuid(),
        'REMOVE_EMPLOYEE',
        'Permission to remove employees'
    ),
    (
        gen_random_uuid(),
        'VIEW_PAYROLL',
        'Permission to view payroll'
    ),
    (
        gen_random_uuid(),
        'MANAGE_ROLES',
        'Permission to manage roles'
    ) ON CONFLICT (key) DO NOTHING;
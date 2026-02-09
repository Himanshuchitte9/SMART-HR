-- SmartHR Database Schema (PostgreSQL)
-- Universal HR Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE IDENTITY & ACCESS
-- ============================================

-- Users table (both owners and employees)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    address TEXT,
    qualification TEXT,
    experience_years INT DEFAULT 0,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('OWNER', 'EMPLOYEE')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_purpose ON users(purpose);
CREATE INDEX idx_users_status ON users(status);

-- Institutes (schools, colleges, offices, companies)
CREATE TABLE institutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('SCHOOL', 'COLLEGE', 'CORPORATE', 'OFFICE', 'FACTORY', 'NGO', 'CUSTOM')),
    address TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(15),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_institutes_owner ON institutes(owner_id);
CREATE INDEX idx_institutes_status ON institutes(status);
CREATE INDEX idx_institutes_type ON institutes(type);

-- Roles (dynamic hierarchy)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    level INT NOT NULL DEFAULT 1,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE(institute_id, name)
);

CREATE INDEX idx_roles_institute ON roles(institute_id);
CREATE INDEX idx_roles_parent ON roles(parent_role_id);
CREATE INDEX idx_roles_level ON roles(level);

-- Permissions (granular access control)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permissions_key ON permissions(key);
CREATE INDEX idx_permissions_category ON permissions(category);

-- Role-Permission mapping
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- ============================================
-- EMPLOYMENT & WORK
-- ============================================

-- Employment mapping (multi-institute support)
CREATE TABLE employment_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    work_type VARCHAR(20) DEFAULT 'FULL_TIME' CHECK (work_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'RESIGNED', 'TERMINATED')),
    start_date DATE NOT NULL,
    end_date DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, institute_id, role_id, start_date)
);

CREATE INDEX idx_employment_user ON employment_map(user_id);
CREATE INDEX idx_employment_institute ON employment_map(institute_id);
CREATE INDEX idx_employment_role ON employment_map(role_id);
CREATE INDEX idx_employment_manager ON employment_map(manager_id);
CREATE INDEX idx_employment_status ON employment_map(status);

-- Employment history (timeline tracking)
CREATE TABLE employment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    action VARCHAR(50) NOT NULL CHECK (action IN ('JOINED', 'PROMOTED', 'TRANSFERRED', 'RESIGNED', 'TERMINATED', 'ROLE_CHANGED')),
    from_date DATE,
    to_date DATE,
    reason TEXT,
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employment_history_user ON employment_history(user_id);
CREATE INDEX idx_employment_history_institute ON employment_history(institute_id);
CREATE INDEX idx_employment_history_action ON employment_history(action);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    applied_role VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    notes TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_job_applications_user ON job_applications(user_id);
CREATE INDEX idx_job_applications_institute ON job_applications(institute_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- ============================================
-- WORKFLOW & AUTOMATION
-- ============================================

-- Workflow definitions (configurable approval flows)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('EMPLOYEE_JOIN', 'LEAVE_APPROVAL', 'PROMOTION', 'TRANSFER', 'RESIGNATION', 'CUSTOM')),
    steps JSONB NOT NULL, -- Array of {role, action, order}
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(institute_id, type)
);

CREATE INDEX idx_workflows_institute ON workflows(institute_id);
CREATE INDEX idx_workflows_type ON workflows(type);

-- Workflow approvals (execution tracking)
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'JOB_APPLICATION', 'LEAVE_REQUEST', etc.
    entity_id UUID NOT NULL,
    current_step INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    action_by UUID REFERENCES users(id) ON DELETE SET NULL,
    action_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_approvals_workflow ON approvals(workflow_id);
CREATE INDEX idx_approvals_entity ON approvals(entity_type, entity_id);
CREATE INDEX idx_approvals_status ON approvals(status);

-- Audit logs (complete system trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    institute_id UUID REFERENCES institutes(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_institute ON audit_logs(institute_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- DOCUMENTS & COMMUNICATION
-- ============================================

-- Document vault
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('AADHAAR', 'PAN', 'CERTIFICATE', 'OFFER_LETTER', 'APPOINTMENT_LETTER', 'EXPERIENCE_LETTER', 'RESUME', 'OTHER')),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_institute ON documents(institute_id);
CREATE INDEX idx_documents_type ON documents(type);

-- Document templates (for auto-generation)
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('OFFER_LETTER', 'APPOINTMENT_LETTER', 'EXPERIENCE_LETTER', 'RELIEVING_LETTER')),
    name VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL, -- HTML with placeholders
    variables JSONB, -- List of available variables
    is_default BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_document_templates_institute ON document_templates(institute_id);
CREATE INDEX idx_document_templates_type ON document_templates(type);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================
-- FUTURE-READY MODULES
-- ============================================

-- Attendance records (plugin-ready)
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'HOLIDAY')),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    device_info JSONB,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, institute_id, date)
);

CREATE INDEX idx_attendance_user ON attendance_records(user_id);
CREATE INDEX idx_attendance_institute ON attendance_records(institute_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);

-- Salary structures (payroll foundation)
CREATE TABLE salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employment_id UUID NOT NULL REFERENCES employment_map(id) ON DELETE CASCADE,
    base_salary DECIMAL(12, 2) NOT NULL,
    allowances JSONB, -- {hra: 5000, da: 3000, ...}
    deductions JSONB, -- {pf: 1800, tax: 5000, ...}
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_salary_structures_employment ON salary_structures(employment_id);
CREATE INDEX idx_salary_structures_effective ON salary_structures(effective_from, effective_to);

-- ============================================
-- SEED DATA - DEFAULT PERMISSIONS
-- ============================================

INSERT INTO permissions (key, name, description, category) VALUES
-- User Management
('VIEW_USERS', 'View Users', 'Can view user profiles', 'USER_MANAGEMENT'),
('ADD_EMPLOYEE', 'Add Employee', 'Can add new employees', 'USER_MANAGEMENT'),
('EDIT_EMPLOYEE', 'Edit Employee', 'Can edit employee details', 'USER_MANAGEMENT'),
('REMOVE_EMPLOYEE', 'Remove Employee', 'Can remove employees', 'USER_MANAGEMENT'),

-- Role Management
('VIEW_ROLES', 'View Roles', 'Can view role hierarchy', 'ROLE_MANAGEMENT'),
('CREATE_ROLE', 'Create Role', 'Can create new roles', 'ROLE_MANAGEMENT'),
('EDIT_ROLE', 'Edit Role', 'Can edit role details', 'ROLE_MANAGEMENT'),
('DELETE_ROLE', 'Delete Role', 'Can delete roles', 'ROLE_MANAGEMENT'),
('ASSIGN_ROLE', 'Assign Role', 'Can assign roles to employees', 'ROLE_MANAGEMENT'),

-- Institute Management
('VIEW_INSTITUTE', 'View Institute', 'Can view institute details', 'INSTITUTE_MANAGEMENT'),
('EDIT_INSTITUTE', 'Edit Institute', 'Can edit institute details', 'INSTITUTE_MANAGEMENT'),
('APPROVE_INSTITUTE', 'Approve Institute', 'Can approve institute registrations', 'INSTITUTE_MANAGEMENT'),

-- Workflow Management
('VIEW_WORKFLOWS', 'View Workflows', 'Can view workflows', 'WORKFLOW_MANAGEMENT'),
('CREATE_WORKFLOW', 'Create Workflow', 'Can create workflows', 'WORKFLOW_MANAGEMENT'),
('EDIT_WORKFLOW', 'Edit Workflow', 'Can edit workflows', 'WORKFLOW_MANAGEMENT'),
('APPROVE_WORKFLOW', 'Approve Workflow', 'Can approve in workflows', 'WORKFLOW_MANAGEMENT'),

-- Application Management
('VIEW_APPLICATIONS', 'View Applications', 'Can view job applications', 'APPLICATION_MANAGEMENT'),
('REVIEW_APPLICATIONS', 'Review Applications', 'Can review and shortlist applications', 'APPLICATION_MANAGEMENT'),

-- Document Management
('VIEW_DOCUMENTS', 'View Documents', 'Can view documents', 'DOCUMENT_MANAGEMENT'),
('UPLOAD_DOCUMENTS', 'Upload Documents', 'Can upload documents', 'DOCUMENT_MANAGEMENT'),
('VERIFY_DOCUMENTS', 'Verify Documents', 'Can verify documents', 'DOCUMENT_MANAGEMENT'),
('GENERATE_LETTERS', 'Generate Letters', 'Can generate offer/appointment letters', 'DOCUMENT_MANAGEMENT'),

-- Attendance Management
('VIEW_ATTENDANCE', 'View Attendance', 'Can view attendance records', 'ATTENDANCE_MANAGEMENT'),
('MARK_ATTENDANCE', 'Mark Attendance', 'Can mark attendance', 'ATTENDANCE_MANAGEMENT'),
('APPROVE_ATTENDANCE', 'Approve Attendance', 'Can approve attendance', 'ATTENDANCE_MANAGEMENT'),

-- Payroll Management
('VIEW_PAYROLL', 'View Payroll', 'Can view payroll information', 'PAYROLL_MANAGEMENT'),
('MANAGE_PAYROLL', 'Manage Payroll', 'Can manage salary structures', 'PAYROLL_MANAGEMENT'),

-- Analytics & Reports
('VIEW_ANALYTICS', 'View Analytics', 'Can view analytics dashboard', 'ANALYTICS'),
('EXPORT_REPORTS', 'Export Reports', 'Can export reports', 'ANALYTICS'),

-- System Administration
('SUPER_ADMIN', 'Super Admin', 'Full system access', 'SYSTEM'),
('AUDIT_LOGS', 'View Audit Logs', 'Can view audit logs', 'SYSTEM');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institutes_updated_at BEFORE UPDATE ON institutes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employment_map_updated_at BEFORE UPDATE ON employment_map
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salary_structures_updated_at BEFORE UPDATE ON salary_structures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

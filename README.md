# SmartHR - Universal HR Management System

> **Enterprise-grade HR management platform designed to scale across educational institutions (schools, colleges) and corporate sectors (offices, companies, organizations) with dynamic role hierarchies, workflow automation, and multi-institute support.**

## 🚀 Features

### ✅ Implemented (Phase 1 & 2)

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration (Owner/Employee)
  - Role-based access control
  - Password hashing with bcrypt

- **Institute Management**
  - Create institutes (School, College, Corporate, Office, Factory, NGO)
  - Super Admin approval workflow
  - Owner assignment
  - Multi-institute support

- **Dynamic Role Hierarchy**
  - Parent-child role relationships
  - Automatic level calculation
  - Organization chart generation
  - Permission inheritance algorithm
  - 30+ granular permissions

- **User Management**
  - Comprehensive user profiles
  - Owner vs Employee distinction
  - Profile management

### 🔨 In Progress

- Employment mapping (multi-institute)
- Job application workflow
- Workflow engine
- Dashboard modules
- Document generation

### 📋 Planned Features

- Attendance module (plugin-ready)
- Payroll integration
- Notification system
- Analytics & reporting
- Mobile app support

## 🏗 Technology Stack

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

### Frontend (Planned)
- **Framework**: Next.js 14 + React
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose (for database)
- Git

### Step 1: Clone Repository

```bash
cd d:\SMART-HR
```

### Step 2: Start Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Verify database is running
docker ps
```

The database will be available at:
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050` (admin@smarthr.com / admin)

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your configuration
# The defaults should work with Docker setup
```

### Step 4: Run Backend

```bash
# Development mode with hot reload
npm run start:dev

# The API will be available at:
# http://localhost:3000
# API Documentation: http://localhost:3000/api/docs
```

## 📚 API Documentation

Once the backend is running, visit **http://localhost:3000/api/docs** for interactive Swagger documentation.

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user (Owner/Employee)
- `POST /auth/login` - Login and get JWT token

#### Institutes
- `POST /institutes` - Create institute (Owner only)
- `GET /institutes/pending` - Get pending approvals (Super Admin)
- `PUT /institutes/:id/approve` - Approve/reject institute
- `GET /institutes/my-institutes` - Get user's institutes

#### Roles
- `POST /roles` - Create role with hierarchy
- `GET /roles/institute/:id/org-chart` - Get organization chart
- `GET /roles/:id/permissions/inherited` - Get inherited permissions
- `PUT /roles/:id/permissions` - Assign permissions

#### Users
- `GET /users/profile` - Get current user profile
- `GET /users/:id` - Get user by ID

## 🗄 Database Schema

The system uses 15+ tables:

**Core Tables:**
- `users` - Universal user registry
- `institutes` - Organizations
- `roles` - Dynamic role hierarchy
- `permissions` - Granular permissions (30+ seeded)
- `role_permissions` - Role-permission mapping

**Employment:**
- `employment_map` - Multi-institute employment
- `employment_history` - Work timeline
- `job_applications` - Application tracking

**Workflow:**
- `workflows` - Configurable approval flows
- `approvals` - Workflow execution
- `audit_logs` - Complete audit trail

**Documents:**
- `documents` - Document vault
- `document_templates` - Letter templates
- `notifications` - Notification queue

**Future-Ready:**
- `attendance_records` - Attendance tracking
- `salary_structures` - Payroll foundation

## 🔑 Default Permissions

The system comes with 30+ pre-seeded permissions across categories:

- **User Management**: VIEW_USERS, ADD_EMPLOYEE, EDIT_EMPLOYEE, REMOVE_EMPLOYEE
- **Role Management**: CREATE_ROLE, EDIT_ROLE, DELETE_ROLE, ASSIGN_ROLE
- **Institute Management**: VIEW_INSTITUTE, EDIT_INSTITUTE, APPROVE_INSTITUTE
- **Workflow Management**: CREATE_WORKFLOW, EDIT_WORKFLOW, APPROVE_WORKFLOW
- **Application Management**: VIEW_APPLICATIONS, REVIEW_APPLICATIONS
- **Document Management**: UPLOAD_DOCUMENTS, VERIFY_DOCUMENTS, GENERATE_LETTERS
- **Attendance**: VIEW_ATTENDANCE, MARK_ATTENDANCE, APPROVE_ATTENDANCE
- **Payroll**: VIEW_PAYROLL, MANAGE_PAYROLL
- **Analytics**: VIEW_ANALYTICS, EXPORT_REPORTS
- **System**: SUPER_ADMIN, AUDIT_LOGS

## 🧪 Testing the System

### 1. Register as Owner

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "Password@123",
    "purpose": "OWNER",
    "qualification": "MBA in HR",
    "experience_years": 5
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password@123"
  }'
```

Save the `access_token` from the response.

### 3. Create Institute

```bash
curl -X POST http://localhost:3000/institutes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "ABC International School",
    "type": "SCHOOL",
    "address": "123 Education Lane, City",
    "contact_email": "contact@abcschool.com",
    "contact_phone": "9876543210"
  }'
```

### 4. Create Role Hierarchy

```bash
# Create Principal role (top level)
curl -X POST http://localhost:3000/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "institute_id": "YOUR_INSTITUTE_ID",
    "name": "Principal",
    "description": "Head of the institution"
  }'

# Create Vice Principal (under Principal)
curl -X POST http://localhost:3000/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "institute_id": "YOUR_INSTITUTE_ID",
    "name": "Vice Principal",
    "parent_role_id": "PRINCIPAL_ROLE_ID",
    "description": "Assistant to Principal"
  }'
```

### 5. View Organization Chart

```bash
curl -X GET http://localhost:3000/roles/institute/YOUR_INSTITUTE_ID/org-chart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🏛 System Architecture

### Role Hierarchy Algorithm

```typescript
// Automatic level calculation
createRole(name, parentRoleId):
  if parentRoleId:
    parentRole = findRole(parentRoleId)
    level = parentRole.level + 1
  else:
    level = 1
  
  save({ name, parentRoleId, level })

// Permission inheritance
getInheritedPermissions(roleId):
  permissions = getDirectPermissions(roleId)
  if role.parentRoleId:
    parentPermissions = getInheritedPermissions(role.parentRoleId)
    permissions = merge(permissions, parentPermissions)
  return permissions

// Access control
canPerformAction(userRole, targetRole, permission):
  if userRole.level >= targetRole.level:
    return false  // Child cannot modify parent
  
  inheritedPermissions = getInheritedPermissions(userRole.id)
  return inheritedPermissions.includes(permission)
```

### Multi-Institute Employment

One employee can work across multiple institutes simultaneously:
- Different roles per institute
- Different managers per institute
- Different work types (Full-time, Part-time, Contract, Freelance)
- Complete work history timeline

## 📁 Project Structure

```
SMART-HR/
├── database/
│   └── schema.sql              # Complete PostgreSQL schema
├── backend/
│   ├── src/
│   │   ├── auth/               # Authentication & JWT
│   │   ├── users/              # User management
│   │   ├── institutes/         # Institute management
│   │   ├── roles/              # Role hierarchy & permissions
│   │   ├── employment/         # Employment mapping (TODO)
│   │   ├── workflow/           # Workflow engine (TODO)
│   │   ├── dashboard/          # Dashboards (TODO)
│   │   ├── documents/          # Document generation (TODO)
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docker-compose.yml          # PostgreSQL + pgAdmin
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Role-based access control (RBAC)
- Hierarchical permission inheritance
- Soft deletes for data recovery
- Audit logs for all actions
- Input validation with class-validator
- SQL injection protection (TypeORM)

## 🚀 Next Steps

### Immediate (Week 1-2)
1. Complete employment mapping module
2. Implement job application workflow
3. Build workflow engine
4. Create dashboard endpoints

### Short-term (Week 3-4)
1. Document generation (Offer/Appointment letters)
2. Frontend application (Next.js)
3. Testing & validation
4. Deployment setup

### Long-term (Phase 2)
1. Attendance module
2. Payroll system
3. Leave management
4. Performance reviews
5. Mobile app
6. Advanced analytics

## 📞 Support

For issues or questions:
1. Check API documentation at `/api/docs`
2. Review database schema in `database/schema.sql`
3. Check implementation plan in artifacts

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using NestJS, PostgreSQL, and TypeScript**

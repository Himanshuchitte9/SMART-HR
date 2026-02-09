# SmartHR - Universal HR Management System

A scalable, enterprise-grade HR management system supporting multiple organizational structures (Schools, Colleges, Corporates, Offices).

## 🚀 Features

- **Dual-Database Support**: PostgreSQL (primary) with MongoDB fallback
- **JWT Authentication**: Secure user authentication and authorization
- **Role-Based Access Control**: Dynamic hierarchical role system
- **Multi-Institute Support**: Manage multiple organizations
- **Modern UI**: React + Vite with responsive design
- **RESTful API**: Clean, documented API endpoints

## 📋 Tech Stack

### Backend
- Node.js + Express
- PostgreSQL / MongoDB
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Modern CSS

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) OR PostgreSQL (v13 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smarthr_db
PG_USER=postgres
PG_HOST=localhost
PG_DB=smarthr
PG_PASSWORD=your_password
PG_PORT=5432
JWT_SECRET=your_secret_key_here
```

Start backend:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Database Setup

### Option 1: MongoDB (Quick Start)
1. Install MongoDB
2. Start MongoDB service
3. Backend will auto-connect

### Option 2: PostgreSQL (Recommended for Production)
1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE smarthr;
   ```
3. Update `.env` with PostgreSQL credentials
4. Restart backend (tables auto-created)

See `POSTGRESQL_SETUP.md` for detailed instructions.

## 🧪 Testing

### Automated Backend Tests
```bash
cd backend
node scripts/verify_backend.js
```

### Manual Testing
See `TESTING_GUIDE.md` for step-by-step testing instructions.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Institutes
- `POST /api/institutes` - Create institute (Owner only)
- `GET /api/institutes` - Get user's institutes

### Roles
- `POST /api/roles` - Create role
- `GET /api/roles/:instituteId` - Get role hierarchy tree

## 🎯 User Roles

- **SUPERADMIN**: System administrator
- **OWNER**: Institute owner/creator
- **EMPLOYEE**: Regular employee

## 📁 Project Structure

```
SMART-HR/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Data models
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── scripts/         # Utility scripts
├── frontend/
│   ├── src/
│   │   ├── pages/      # React pages
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React context
│   │   └── api/        # API configuration
│   └── public/
└── docs/               # Documentation
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based access control
- Input validation

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Use PostgreSQL in production
3. Enable HTTPS
4. Set up proper CORS
5. Add rate limiting

### Frontend
```bash
npm run build
```
Deploy `dist/` folder to your hosting service.

## 📝 License

MIT License

## 👥 Contributing

Contributions welcome! Please read contributing guidelines first.

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for modern HR management**

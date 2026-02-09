# SmartHR - Quick Start Guide

## 🚀 Quick Start (Without Docker)

If you don't have Docker installed, follow these steps:

### 1. Install PostgreSQL Manually

Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

During installation:
- Username: `postgres`
- Password: Choose a password (remember it!)
- Port: `5432`

### 2. Create Database

Open pgAdmin or use psql command line:

```sql
CREATE DATABASE smarthr_db;
CREATE USER smarthr_user WITH PASSWORD 'smarthr_password';
GRANT ALL PRIVILEGES ON DATABASE smarthr_db TO smarthr_user;
```

### 3. Run Database Schema

```bash
cd d:\SMART-HR\database
psql -U smarthr_user -d smarthr_db -f schema.sql
```

### 4. Update Backend .env

Edit `d:\SMART-HR\backend\.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=smarthr_user
DB_PASSWORD=smarthr_password
DB_DATABASE=smarthr_db
```

### 5. Start Backend

```bash
cd d:\SMART-HR\backend
npm run start:dev
```

Backend will run at: http://localhost:3000

### 6. Start Frontend

```bash
cd d:\SMART-HR\frontend
npm run dev
```

Frontend will run at: http://localhost:5173

## 🎯 Test the Application

1. Open http://localhost:5173
2. Click "Register here"
3. Fill in the form (select "Owner" as purpose)
4. Login with your credentials
5. Create an institute
6. Create roles and view org chart

## 📝 API Documentation

Once backend is running, visit: http://localhost:3000/api/docs

## ⚠️ Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database and user exist

### Frontend shows errors
- Check if backend is running at http://localhost:3000
- Open browser console for detailed errors
- Verify API calls in Network tab

### Database connection failed
- Check PostgreSQL service is running
- Verify credentials match in `.env`
- Test connection with pgAdmin

## 🔧 Alternative: Use Docker

If you have Docker installed:

```bash
cd d:\SMART-HR
docker-compose up -d
cd backend
npm run start:dev
```

Then in another terminal:

```bash
cd d:\SMART-HR\frontend
npm run dev
```

## 📞 Need Help?

Check the main README.md for detailed documentation.

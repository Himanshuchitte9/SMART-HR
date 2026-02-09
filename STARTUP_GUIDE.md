# SmartHR - Complete Startup Guide

## 🎯 Current Status

✅ **Backend Code**: Ready  
✅ **Frontend Code**: Ready  
✅ **PostgreSQL**: Installed  
✅ **MongoDB**: Running (fallback)  
⏳ **PostgreSQL Database**: Needs to be created  

## 📋 Step-by-Step Startup

### Step 1: Create PostgreSQL Database (One-time)

**Using pgAdmin (Easiest):**
1. Open **pgAdmin 4** from Start Menu
2. Click **PostgreSQL 16** → Enter password: `VAIBHAV@22`
3. Right-click **"Databases"** → **Create** → **Database**
4. Name: `smarthr` (lowercase!)
5. Click **Save**

**Using SQL Shell:**
1. Open **SQL Shell (psql)** from Start Menu
2. Press Enter for all prompts
3. Enter password: `VAIBHAV@22`
4. Run: `CREATE DATABASE smarthr;`

### Step 2: Start Backend

```bash
cd d:\SMART-HR\backend
npm start
```

**Expected Output:**
```
✅ Connected to PostgreSQL
✅ PostgreSQL Tables Initialized
Server running on port 5000
```

**If you see "Falling back to MongoDB":**
- Database nahi bana → Step 1 repeat karo
- Password wrong hai → `.env` check karo

### Step 3: Start Frontend

```bash
cd d:\SMART-HR\frontend
npm run dev
```

**Expected Output:**
```
VITE v7.3.1  ready in 758 ms
➜  Local:   http://localhost:5173/
```

### Step 4: Test Application

1. Open browser: **http://localhost:5173**
2. Click **"Register"**
3. Fill form:
   - Name: Your Name
   - Email: test@example.com
   - Mobile: 9876543210
   - Password: test123
   - Purpose: **Owner**
4. Click **Register**
5. You should see **Dashboard** 🎉

## 🔧 Troubleshooting

### Backend won't start
```bash
# Kill all node processes
taskkill /F /IM node.exe
# Start again
npm start
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Database connection failed
1. Check PostgreSQL service is running:
   - Press `Win+R` → type `services.msc`
   - Find "postgresql-x64-16"
   - Right-click → Start

2. Verify database exists:
   - Open pgAdmin
   - Check if "smarthr" database is there

### CORS errors
- Backend should be on port 5000
- Frontend should be on port 5173
- Both must be running

## 🚀 Quick Start (After First Setup)

```bash
# Terminal 1 - Backend
cd d:\SMART-HR\backend
npm start

# Terminal 2 - Frontend
cd d:\SMART-HR\frontend
npm run dev
```

Then open: **http://localhost:5173**

## 📊 What's Running

| Service | URL | Status |
|---------|-----|--------|
| Backend API | http://localhost:5000 | ✅ Running |
| Frontend | http://localhost:5173 | ✅ Running |
| PostgreSQL | localhost:5432 | ⏳ Database needed |
| MongoDB | localhost:27017 | ✅ Fallback active |

## ✅ Success Indicators

**Backend:**
- `✅ Connected to PostgreSQL` = Perfect!
- `⚠️ Falling back to MongoDB` = Database issue

**Frontend:**
- `Local: http://localhost:5173/` = Perfect!

**Application:**
- Can register user = ✅
- Can login = ✅
- Dashboard shows = ✅

---

**Next Steps:**
1. Create database using pgAdmin (Step 1)
2. Restart backend
3. Test registration

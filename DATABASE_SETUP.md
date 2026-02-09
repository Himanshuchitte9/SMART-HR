# PostgreSQL Database Setup - Manual Steps

## ✅ PostgreSQL Install Ho Gaya Hai!

Tumhara PostgreSQL install hai aur password bhi set hai (`VAIBHAV@22`).

## 🎯 Ab Bas Database Banana Hai

### Option 1: pgAdmin se (RECOMMENDED - Easy!)

1. **Start Menu** kholo aur search karo: `pgAdmin 4`
2. pgAdmin khulega, left side mein **"Servers"** dikhega
3. **"PostgreSQL 16"** (ya jo version hai) pe click karo
4. **Password daalo**: `VAIBHAV@22`
5. Left side mein **"Databases"** pe **RIGHT-CLICK** karo
6. **"Create"** → **"Database..."** select karo
7. **Database name** mein type karo: `smarthr` (lowercase!)
8. **"Save"** button pe click karo

✅ Done! Database ban gaya!

### Option 2: SQL Shell se

1. **Start Menu** → Search: `SQL Shell (psql)`
2. Sab prompts mein **Enter** dabao (defaults use karne ke liye)
3. **Password** daalo: `VAIBHAV@22`
4. Ye command type karo:
```sql
CREATE DATABASE smarthr;
```
5. Enter dabao

✅ Done!

## 🚀 Ab Backend Start Karo

Database ban jane ke baad:

1. Terminal mein jaao
2. Backend folder mein:
```bash
cd d:\SMART-HR\backend
npm start
```

## ✅ Success Check

Terminal mein ye dikhna chahiye:
```
✅ Connected to PostgreSQL
✅ PostgreSQL Tables Initialized
Server running on port 5000
```

Agar ye dikha to **SUCCESS!** 🎉

## ❌ Agar Phir Bhi Error Aaye

### Error: "database does not exist"
→ Database nahi bana. Upar ke steps phir se karo.

### Error: "password authentication failed"
→ Password galat hai. `.env` file check karo.

### Still MongoDB pe connect ho raha hai?
→ Backend server **restart** karo (Ctrl+C then npm start)

---

**Current Status:**
- ✅ PostgreSQL Installed
- ✅ Password Set: `VAIBHAV@22`
- ⏳ Database: Create karna hai (upar ke steps follow karo)
- ✅ .env file: Fixed (database name lowercase kar diya)

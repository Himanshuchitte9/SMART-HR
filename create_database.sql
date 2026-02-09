-- SmartHR PostgreSQL Database Setup Script
-- Run this in pgAdmin or psql after installing PostgreSQL
-- Create the database (run this first)
CREATE DATABASE smarthr;
-- Connect to the database
\ c smarthr -- Now the tables will be created automatically by the Node.js server
-- when it starts up. This script is just for creating the database.
-- To verify the database was created, run:
-- \l
-- To see all tables after server starts, run:
-- \dt
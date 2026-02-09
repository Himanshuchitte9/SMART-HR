import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, getDBType } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.routes.js';

app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

import instituteRoutes from './routes/institute.routes.js';

import roleRoutes from './routes/role.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import payrollRoutes from './routes/payroll.routes.js';
import documentRoutes from './routes/document.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import taskRoutes from './routes/task.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/tasks', taskRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send(`API is running. Connected DB: ${getDBType()}`);
});

import initPGScreens from './models/schemaInit.js';

// Start Server
const startServer = async () => {
    await connectDB();
    await initPGScreens();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

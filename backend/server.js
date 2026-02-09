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

app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/roles', roleRoutes);

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

import { connectDB, query, getDBType } from '../config/db.js';
import initPGScreens from '../models/schemaInit.js';

const run = async () => {
    console.log('🔌 Connecting to DB...');
    await connectDB();
    console.log(`✅ Connected Type: ${getDBType()}`);

    if (getDBType() === 'PG') {
        console.log('🛠 Initializing PG Tables...');
        try {
            await initPGScreens();
            console.log('✅ Tables Initialized');
        } catch (e) {
            console.error('❌ Init Failed:', e);
        }
    } else {
        console.log('ℹ️ Connected to Mongo, skipping PG init.');
    }

    process.exit(0);
};

run();

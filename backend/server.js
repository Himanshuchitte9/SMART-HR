
const app = require('./src/app');
const config = require('./src/config/env');
const { connectMongo, connectPostgres } = require('./src/config/db');
const { ensureSuperAdmin } = require('./src/services/bootstrapService');

const startServer = async () => {
    try {
        // 1. Connect Databases
        await connectMongo();
        await connectPostgres();

        // 2. Start Express Server
        app.listen(config.port, () => {
            console.log(`🚀 Server running in ${config.env} mode on port ${config.port}`);
        });

    } catch (error) {
        console.error('❌ Server failed to start:', error);
        process.exit(1);
    }
};

startServer();

import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
    logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.info(err.name, err.message, err);
    process.exit(1);
});

import app from './app';
import logger from './logger/logs';

const DB = (process.env.DATABASE ?? '').replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD ?? ''
);

mongoose.connect(DB).then(() => logger.info('Database connection successful'));

const PORT = process.env.SERVER_PORT || 3232;
const server = app.listen(PORT, () => {
    logger.info(`Application listening a port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    logger.info(err);
    logger.info('Authentication failed.💥 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

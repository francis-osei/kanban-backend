import mongoose from 'mongoose';

process.on('uncaughtException', () => {
    // logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    // logger.info(err.name, err.message, err);
    process.exit(1);
});

import app from './app';


const DB = (process.env.DATABASE ?? '').replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD ?? ''
);

// eslint-disable-next-line no-console
mongoose.connect(DB).then(() => console.log('Database connection successful'));

const PORT = process.env.SERVER_PORT || 3232;
const server = app.listen(PORT, () => {});

process.on('unhandledRejection', () => {
    // logger.info('Authentication failed.💥 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

export default app;

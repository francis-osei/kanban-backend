import { Server } from 'http';

export const handleUncuaghtException = (): void => {
    process.on('uncaughtException', () => {
        // logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
        // logger.info(err.name, err.message, err);
        process.exit(1);
    });
};

export const handleUnhandledRejection = (server: Server): void => {
    process.on('unhandledRejection', () => {
        // logger.info('Authentication failed.💥 Shutting down...');
        server.close(() => {
            process.exit(1);
        });
    });
};

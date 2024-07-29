import { Express } from 'express';
import api from './app';
import {
    handleUncuaghtException,
    handleUnhandledRejection,
} from './utils/errors';

const start = (): Express => {
    handleUncuaghtException();

    const app = api();

    const PORT = process.env.SERVER_PORT;
    const server = app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log('server running on port: ' + PORT);
    });

    handleUnhandledRejection(server);

    return app;
};

start();

export default start;

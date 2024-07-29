import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import globalErrorHandler from './controllers/errorController';
import handleUndefinedRoutes from './middlewares/handleUndefinedRoutes';
import KanbanApp from './routes/kanban.api';
import database, { getDB_url } from './configs/database';

const api = (): Express => {
    const app = express();
    dotenv.config();

    app.use(cors());
    app.options('*', cors({ credentials: true }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());
    app.use(mongoSanitize());

    app.use(morgan('dev'));

    const DB_url = getDB_url();
    database.connect(DB_url);

    KanbanApp(app);

    app.all('*', handleUndefinedRoutes);
    app.use(globalErrorHandler);

    return app;
};

export default api;

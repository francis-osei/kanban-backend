import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import userRouter from "./routes/userRoutes"
import logger from './logger/logs';

const app = express();
dotenv.config();

app.use(cors());
app.options('*', cors({ credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(mongoSanitize());

if (process.env.NODE_ENV === 'development') {
    logger.info(process.env.NODE_ENV);
    app.use(morgan('dev'));
}

app.get('/', (_req: Request, res: Response) => {
    res.send('Express server running');
});

app.use('/api', userRouter)

export default app;

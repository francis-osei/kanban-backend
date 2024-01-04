import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

app.use(cors());
app.options('*', cors({ credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (_req: Request, res: Response) => {
    res.send('Express server running');
});

export default app;

import { Application, Request, Response } from 'express';
import authRouter from './authRoutes';
import userRouter from './userRoutes';
import tasksRouter from './authRoutes';

const routes = (app: Application) => {
    app.get('/', (_req: Request, res: Response) => {
        // res.send('Express server running!!!!');
        res.redirect('/api/docs');
    });
    app.use('/api', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/tasks', tasksRouter);
};

export default routes;

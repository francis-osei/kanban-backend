import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import { SuccessCodes } from '../utils/statusCode';
import { findUsersIn } from '../services/userServices';
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTask,
    updateTask,
} from '../services/taskServices';
import { formatDate } from '../utils/helpers';
import AppError from '../utils/appError';

export const addTask = catchAsync(async (req: Request, res: Response) => {
    const { assignees, deadline } = req.body;

    const users = await findUsersIn(assignees);
    const newTask = {
        ...req.body,
        assignees: users,
        deadline: formatDate(deadline),
    };

    const task = await createTask(newTask);

    res.status(SuccessCodes.ok).json({
        status: 'success',
        data: { task },
    });
});

export const removeTask = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const response = await deleteTask(id);

        if (response instanceof AppError) {
            return next(new AppError(response.message, response.statusCode));
        }

        res.status(SuccessCodes.noContent).json({
            status: 'success',
            message: 'Task was deleted successfully',
        });
    }
);

export const allTask = catchAsync(async (_req: Request, res: Response) => {
    const tasks = await getAllTasks();

    res.status(SuccessCodes.ok).json({
        status: 'success',
        data: { tasks },
    });
});

export const renewTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { assignees, deadline } = req.body;

    const users = await findUsersIn(assignees);
    const updatedTask = {
        ...req.body,
        assignees: users,
        deadline: formatDate(deadline),
    };

    const task = await updateTask(id, updatedTask);

    res.status(SuccessCodes.ok).json({
        status: 'success',
        data: task,
    });
});

export const retrieveTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const task = await getTask(id);

    res.status(SuccessCodes.ok).json({
        status: 'success',
        data: task,
    });
});

import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import { SuccessCodes } from '../utils/statusCode';
import { findUsersIn } from '../services/userServices';
import { createTask, deleteTask } from '../services/taskServices';
import { formatDate } from '../utils/helpers';
import AppError from '../utils/appError';

export const addTask = catchAsync(async (req: Request, res: Response) => {
    const { assignees, deadline } = req.body;

    const users = await findUsersIn(assignees);
    const assigneesId = users.map((user) => user._id);
    const newTask = {
        ...req.body,
        assignees: assigneesId,
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

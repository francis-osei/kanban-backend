import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import { SuccessCodes } from '../utils/statusCode';
import { findUsersIn } from '../services/userServices';
import { createTask } from '../services/taskServices';
import { formatDate } from '../utils/helpers';

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

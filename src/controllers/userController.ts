import { Request, Response } from 'express';

import { createUser } from '../services/userServices';
import catchAsync from '../utils/catchAsync';

export const createNewUser = catchAsync(async (req: Request, res: Response) => {
    const user = await createUser(req.body);

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

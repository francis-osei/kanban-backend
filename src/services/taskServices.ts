import TaskModel, { TasksInput } from '../models/taskModel';
import AppError from '../utils/appError';
import { ServerErrorCodes } from '../utils/statusCode';

export const createTask = async (input: TasksInput): Promise<TasksInput> => {
    const newTask = await TaskModel.create(input);

    return newTask;
};

export const getAllTasks = async (): Promise<
    TasksInput[] | { message: string }
> => {
    const tasks = await TaskModel.find();

    if (tasks.length === 0) {
        return { message: 'There are no tasks' };
    }

    return tasks;
};

export const getTask = async (
    taskId: string
): Promise<TasksInput | { message: string } | null> => {
    const tasks = await TaskModel.findById(taskId);

    if (tasks === null) {
        return { message: 'The task id provided does not belong to any task' };
    }

    return tasks;
};

export const deleteTask = async (
    taskId: string
): Promise<boolean | AppError> => {
    const task = await TaskModel.deleteOne({
        _id: taskId,
    });

    if (task.deletedCount) return true;

    return new AppError(
        'could not delete user',
        ServerErrorCodes.internalServerError
    );
};

export const updateTask = async (
    taskId: string,
    input: TasksInput
): Promise<TasksInput | { message: string } | null> => {
    const task = await TaskModel.findByIdAndUpdate({ _id: taskId }, input, {
        new: true,
        runValidators: true,
    });

    if (task === null) {
        return { message: 'The task id provided does not belong to any task' };
    }

    return task;
};

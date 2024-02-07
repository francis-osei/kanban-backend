import TaskModel, { TasksInput } from '../models/taskModel';

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

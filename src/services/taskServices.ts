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

export const getTask = async (
    taskId: string
): Promise<TasksInput | { message: string } | null> => {
    const tasks = await TaskModel.findById(taskId);

    if (tasks === null) {
        return { message: 'The task id provided does not belong to any task' };
    }

    return tasks;
};

import TaskModel, { TasksInput } from '../models/taskModel';

export const createTask = async (input: TasksInput): Promise<TasksInput> => {
    const newTask = await TaskModel.create(input);

    return newTask;
};

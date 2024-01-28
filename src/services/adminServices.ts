import UserModel, { UserInput } from '../models/userModel';

export const createAdmin = async (input: UserInput): Promise<UserInput> => {
    const user = await UserModel.create({ ...input, role: 'admin' });

    return user;
};

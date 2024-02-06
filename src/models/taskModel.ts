import mongoose, { Types } from 'mongoose';

export interface TasksInput {
    title: string;
    description: string;
    assignees: Types.ObjectId[] | User[];
    deadline: Date;
    status: string;
    progress: number;
}

interface User {
    _id: Types.ObjectId;
}

export interface TaskDocument extends TasksInput, Document {
    _id: string;
    createdAt: Date;
    updateAt: Date;
}

const taskSchema = new mongoose.Schema<TasksInput>(
    {
        title: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Please provide a title for'],
        },

        description: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Please provide a title for'],
        },

        status: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Please provide a title for'],
        },

        assignees: {
            type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
            required: [true, 'Please provide at least one Assignee'],
        },

        progress: {
            type: Number,
            default: 0,
        },

        deadline: Date,
    },
    { timestamps: true }
);

const Task = mongoose.model<TasksInput>('Task', taskSchema);

export default Task;

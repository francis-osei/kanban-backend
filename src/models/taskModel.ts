import mongoose, { Types, Query, Document } from 'mongoose';

export interface TasksInput {
    title: string;
    description: string;
    assignees: Types.ObjectId[] | User[] | undefined;
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
            required: [true, 'Please provide a title'],
        },

        description: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Please provide a description'],
        },

        status: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Please provide a status'],
        },

        assignees: {
            type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
            validate: {
                validator: function (
                    value: mongoose.Types.Array<mongoose.Types.ObjectId>
                ) {
                    return value && value.length > 0;
                },
                message: 'Please provide assignees',
            },
        },

        progress: {
            type: Number,
            default: 0,
        },

        deadline: Date,
    },
    { timestamps: true }
);

taskSchema.pre(
    /^find/,
    function (this: Query<TaskDocument[], TaskDocument>, next) {
        this.populate({
            path: 'assignees',
            select: '-__v -confirmPassword -createdAt -updatedAt -rank -specialization -status -role',
        });

        next();
    }
);

const Task = mongoose.model<TasksInput>('Task', taskSchema);

export default Task;

import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface UserInput {
    photo: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string | undefined;
    passwordChangedAt?: Date | number;
    passwordResetToken?: string | null;
    passwordResetExpires: Date;
}

export interface UserDocument extends UserInput, Document {
    _id: string;
    createdAt: Date;
    updateAt: Date;
}

const userSchema = new mongoose.Schema<UserInput>(
    {
        photo: {
            type: String,
            required: [true, 'Please upload your photo'],
            default: 'default.jpg',
        },

        email: {
            type: String,
            required: [true, 'Email must not be empty'],
            trim: true,
            unique: true,
            lowerCase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },

        fullName: {
            type: String,
            required: [true, 'Please tell use your full name'],
            trim: true,
        },

        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: [8, 'Password should be more than 8 character'],
            select: false,
        },

        confirmPassword: {
            type: String,
            required: [8, 'Please confirm your password'],
            validate: {
                validator: function (el: string): boolean {
                    const user = this as UserInput;
                    return el === user.password;
                },
                message: 'Passwords are not the same',
            },
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (this: UserDocument, next) {
    if (!this.isModified('password')) return next();

    const password = this.password;
    const saltRound: number = Number(process.env.SALT_ROUND) ?? '';
    const generateSalt = await bcrypt.genSalt(saltRound);

    const hashedPassword = bcrypt.hashSync(password, generateSalt);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

const User = mongoose.model<UserInput>('User', userSchema);

export default User;

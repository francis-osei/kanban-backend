import crypto from 'crypto';

import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface UserInput {
    photo: string;
    fullName: string;
    email: string;
    password: string | undefined;
    confirmPassword: string | undefined;
    specialization: string;
    status: string;
    aboutMe: string;
    rank: string;
    isFirstTimeLogin: boolean;
    passwordChangedAt?: Date | number;
    passwordResetToken?: string | null;
    passwordResetExpires: Date | { $gt: Date } | null;
}

export interface UserMethods extends UserInput, Document {
    _id: string;
    createPasswordResetToken: () => string;
    comparePasswords: (
        candidatePassword: string,
        userPassword: string | undefined
    ) => Promise<boolean>;
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

        status: {
            type: String,
            enum: ['inactive', 'active'],
            default: 'inactive',
        },

        specialization: { type: String, trim: true, lowerCase: true },
        rank: { type: String, trim: true, lowerCase: true },
        aboutMe: { type: String, trim: true, lowerCase: true },
        isFirstTimeLogin: { type: Boolean, default: false },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true }
);

userSchema.pre('save', async function (this: UserDocument, next) {
    if (!this.isModified('password')) return next();

    const password = this.password as string;
    const saltRound: number = Number(process.env.SALT_ROUND) || 0;
    const generateSalt = await bcrypt.genSalt(saltRound);

    const hashedPassword = bcrypt.hashSync(password, generateSalt);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const tenMimutes = 10 * 60 * 1000;
    this.passwordResetExpires = Date.now() + tenMimutes;

    return resetToken;
};

userSchema.methods.comparePasswords = async function (
    candidatePassword: string,
    userPassword: string
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<UserInput>('User', userSchema);

export default User;

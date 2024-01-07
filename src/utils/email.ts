import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';

import { UserInput } from '../models/userModel';

class Email {
    to: string;
    url: string | undefined;
    from: string;
    firstName: string;

    constructor(user: UserInput, url: string | undefined) {
        this.to = user.email;
        this.firstName = user.fullName.split(' ')[0];
        this.url = url;
        this.from = `Kanban Team`;
    }

    newTransport() {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        return transporter;
    }

    async send(template: string, subject: string) {
        const html = pug.renderFile(`./views/email/${template}.pug`, {
            firstName:
                this.firstName.charAt(0).toUpperCase() +
                this.firstName.slice(1),
            email: this.to,
            url: this.url,
            subject,
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html),
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendVerification() {
        await this.send('verification', 'Verify your account');
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Kanban');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Reset Your Password (valid for 10 minutes)'
        );
    }
}

export default Email;

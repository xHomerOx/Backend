import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'homero.tw@gmail.com',
        pass: 'xgec hatm jhwk otdc'
    }
});
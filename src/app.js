import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils/dirnameUtil.js';
import productsRouter from './routes/productsRoute.js';
import cartsRouter from './routes/cartsRoute.js';
import viewsRouter from './routes/viewsRoute.js';
import sessionRouter from './routes/sessionRoute.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import messageModel from './dao/models/messageModel.js';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import nodemailer from 'nodemailer';

const app = express();

const uri = 'mongodb+srv://xHomerOx:oU4p3VvHAh11lf7s@ecommerce.ix5vqim.mongodb.net/ecommerce?retryWrites=true&w=majority';
mongoose.connect(uri);

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'homero.tw@gmail.com',
        pass: 'xgec hatm jhwk otdc'
    }
});

initializePassport();
app.use(passport.initialize());

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (_req, res) => {
    res.send(`
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
    </head>
    <body>
        <h1>Welcome to the root path!</h1>
        <p>Go to /products to see content! (ChatBox is in /products/chatbox)</p>
        <p>Endpoints:</p>
        <p>/api/users/register</p>
        <p>/api/users/login</p>
        <p>/api/users/current</p>
        <p>/api/users/:uid</p>
        <p>/products</p>
        <p>/products/realtimeproducts</p>
        <p>/products/register</p>
        <p>/products/login</p>
    </body>
    `);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', sessionRouter);
app.use('/products', viewsRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Server Started`);
});

const socketServer = new Server(httpServer);

let messages = [];

socketServer.on("connection", socket => {
    socket.on("message", data => {
        messages.push(data);
        socketServer.emit("messages", messages);
        const chatLogs = new messageModel({
            user: data.user,
            message: data.message
        });
        chatLogs.save().then(() => console.log('Messages saved'));
    });
});

export { socketServer }; 
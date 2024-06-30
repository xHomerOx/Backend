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
import roleHelper from './helpers/roleHelper.js';

const app = express();

const uri = 'mongodb+srv://xHomerOx:oU4p3VvHAh11lf7s@ecommerce.ix5vqim.mongodb.net/ecommerce?retryWrites=true&w=majority';
mongoose.connect(uri);

initializePassport();
app.use(passport.initialize());

app.engine('handlebars', exphbs.engine({ defaultLayout: false, helpers: roleHelper }));

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
        <p>/products</p>
        <p>/products/realtimeproducts</p>
        <p>/products/register</p>
        <p>/products/login</p>
        <p>/products/recover</p>
        <p>/products/changepassword</p>
        <p>/api/users/premium/:uid</p>
        PREMIUM DEFAULT USER UID = 66801cd61f5f7e41242cd863
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
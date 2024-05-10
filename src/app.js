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

const app = express();

const uri = 'mongodb+srv://xHomerOx:oU4p3VvHAh11lf7s@ecommerce.ix5vqim.mongodb.net/ecommerce?retryWrites=true&w=majority';
mongoose.connect(uri);

initializePassport();
app.use(passport.initialize());

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (_req, res) => {
    res.send('Welcome to the root path! Go to /products to see content! (ChatBox is in /products/chatbox)');
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
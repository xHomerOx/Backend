import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils/dirnameUtil.js';
import productsRouter from './routes/productsRoute.js';
import cartsRouter from './routes/cartsRoute.js';
import viewsRouter from './routes/viewsRoute.js';
import sessionsRouter from './routes/sessionsRoute.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import usersRouter from './routes/usersRoute.js';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const uri = process.env.DB_CONNECTION;
mongoose.connect(uri);

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', viewsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/products/', productsRouter);
app.use('/api/users/', usersRouter);
app.use('/api/sessions', sessionsRouter);

app.use(session({
    store: mongoStore.create(
        {
            mongoUrl: uri,
            ttl: 300000
        }
    ),
    secret: 'myApiKey',
    resave: false,
    saveUninitialized: false,
    failLogin: false,
    failRegister: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Server Started`);
});

const socketServer = new Server(httpServer);

let messages = [];

socketServer.on("connection", socket => {
    socket.on("message", data => {
        messages.push(data);
    });
});

export { socketServer }; 
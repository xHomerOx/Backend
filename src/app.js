import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils/dirnameUtil.js';
import viewsRouter from './routes/viewsRoute.js';
import usersRouter from './routes/usersRoute.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import productsRouter from './routes/productsRoute.js';
import cartsRouter from './routes/cartsRoute.js';
import dotenv from 'dotenv';
import messageModel from './models/messageModel.js';
import compression from 'express-compression';
import errors from './middlewares/errors/index.js';
import { addLogger, startLogger } from './utils/loggerUtil.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

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
app.use(compression());
app.use(errors);

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

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce',
            version: '1.0.0',
            description: 'API for ecommerce'
        } 
    },
    apis: [`${__dirname}/../docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger);

app.use('/', viewsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/products/', productsRouter);
app.use('/api/users/', usersRouter);

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    startLogger(`Server Started at ${new Date().toLocaleTimeString()}`);
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
        chatLogs.save().then(() => startLogger(`Messages saved at ${new Date().toLocaleTimeString()}`));
    });
});

export { socketServer }; 
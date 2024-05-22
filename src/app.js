import express from 'express';
import path from 'path';
import __dirname from './utils/dirnameUtil.js';
import viewsRouter from './routes/viewsRoute.js';
import usersRouter from './routes/usersRoute.js';
import sessionsRouter from './routes/sessionsRouter.js';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';
import productsRouter from './routes/productsRoute.js';
import cartsRouter from './routes/cartsRoute.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const uri = process.env.DB_CONNECTION;
mongoose.connect(uri);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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

app.get('/', (_req, res) => {
    return res.redirect("/products");
});

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Started`);
});
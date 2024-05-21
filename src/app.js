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
import initializePassport from './config/passport.config.js';

const app = express();

const uri = 'mongodb+srv://xHomerOx:oU4p3VvHAh11lf7s@ecommerce.ix5vqim.mongodb.net/ecommerce?retryWrites=true&w=majority';
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
    return res.redirect("/login");
});

app.use('/', viewsRouter);
app.use('/', usersRouter);
app.use('/api/sessions', sessionsRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Started`);
});
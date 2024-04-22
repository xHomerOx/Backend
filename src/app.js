import express from 'express';
import path from 'path';
import __dirname from './utils/dirnameUtil.js';
import viewsRouter from './routes/viewsRoute.js';
import usersRouter from './routes/usersRoute.js';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mongoStore from 'connect-mongo';

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
            ttl: 20
        }
    ),
    secret: 'myApiKey',
    resave: true,
    saveUninitialized: true
}));


app.get('/', (_req, res) => {
    const title = 'Login Form';
    const body = 'Go to /login or /register to login to page. Go to Products to see User details.';
    res.render('layouts/main', { title: title, body: body });
});
app.use('/', viewsRouter);
app.use('/api/sessions', usersRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Started`);
});
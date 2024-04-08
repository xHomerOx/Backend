import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils/utils.js';
import productsRouter from './routes/productsRoute.js';
import cartsRouter from './routes/cartsRoute.js';
import viewsRouter from './routes/viewsRoute.js';
import { Server } from 'socket.io';

const app = express();

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (_req, res) => {
    res.send('Welcome to the root path! Go to /products to see content!');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', viewsRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Server Started`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", socket => {
    socket.on("message", data => {
        console.log(data);
    });
});

export { socketServer }; 
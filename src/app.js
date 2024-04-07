import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils/utils.js';
import cartsRouter from './routes/cartsRoute.js';
import viewsRouter from './routes/viewsRoute.js';
import { Server } from 'socket.io';

const app = express();

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use("/", cartsRouter);
app.use("/realtimeproducts", viewsRouter);

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
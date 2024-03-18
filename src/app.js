import express from 'express';

//Uso esto para un Layout customizado.
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';

//Me traigo solo el Router de Carts, por eso lo puse entre llaves.
import { cartsRouter } from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();

//Para que solo renderice la vista Home y no el Layout por defecto de Handlebars.
app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

//Configuro motor y estructura del Proyecto.
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

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

socketServer.on("productAdded", (updatedProducts) => {
    console.log(updatedProducts);
});

export { socketServer }; 
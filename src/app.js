import express from 'express';

//Uso esto para un Layout customizado.
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import cartsRouter from './routes/carts.router.js';
import {viewsRouter, myIndex } from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();

//Para que solo renderice la vista Home y no el Layout por defecto de Handlebars.
app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

//Configuro motor y estructura del Proyecto.
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + 'public'));

app.use("/", cartsRouter);
app.use("/realtimeproducts", viewsRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", _socket => {
    console.log(myIndex);
});
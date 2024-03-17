import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import router from './routes/carts.router.js';

const app = express();

//Para que solo renderice la vista Home y no el Layout por defecto de Handlebars.
app.engine('handlebars', exphbs.engine({ defaultLayout: false }));

//Configuro motor y estructura del Proyecto.
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(__dirname + '/public'));
app.use("/", router);

const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
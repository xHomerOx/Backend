import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

const app = express();

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))

const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
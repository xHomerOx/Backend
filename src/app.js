import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

async function myGreetings() {
    return '<font face="arial">Ir a "/products" para ver el listado</font>'
}

app.get('/', async (_req, res) => {
    let greetings = await myGreetings();
    res.send(greetings);
})

const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
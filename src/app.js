import express from 'express';
import ProductManager from './productManager.js';

const myProducts = new ProductManager();

const app = express();

app.use(express.urlencoded({ extended: true }));

//Creo la funcion asincrona de mi saludo -- en Arial sin estilo SaSS/CSS3 ya que es lo unico que voy a mostrar --
async function myGreetings() {
    return '<font face="arial">Ir a "/products" para ver el listado</font>'
}

//Devuelvo mi saludo.
app.get('/', async (req, res) => {
    let greetings = await myGreetings();
    res.send(greetings);
})

//Voy al Endpoint de products para ver los resultados y filtrar.
app.get('/products/', async (req, res) => {
    try{
        let limit = req.query.limit;

        //Devuelve el limite sorteado/ordenado desde el primero cuando castea la funcion.
        const products = await myProducts.getProducts(limit);
        res.json(products);
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//Llamo a getProductById y ejecuto metodo find.
app.get('/products/:pid', async (req, res) => {
    try{
        //ya que req.params es un string junto a pid lo pase a entero.
        let pid = parseInt(req.params.pid);

        //Si no encuentra el ID devolvera el mensaje del metodo/function o NaN si es String.
        const products = await myProducts.getProductById(pid);
        res.json(products);
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
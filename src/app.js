import express from 'express';
import ProductManager from './productManager.js';

const myProducts = new ProductManager();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
    try{
        let limit = req.query.limit;

        const products = await myProducts.getProducts(limit);
        res.json(products);
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
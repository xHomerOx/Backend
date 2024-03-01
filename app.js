import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/products', async (req, res) => {
    try{
        const products = await fs.promises.readFile('./myFile/products.json');
        const myObject = JSON.parse(products);
        res.json(myObject);
    }catch{
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


const PORT = 8080;

app.listen(PORT, () => console.log("Server Started"));
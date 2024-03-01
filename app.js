import express from 'express';
import myProducts from './myFile/products.json' assert { type: "json" };

const app = express();

app.get('/products', (req, res) => {
    console.log(myProducts);
});

app.listen(8080, () => console.log("Server Started"));
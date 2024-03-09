import { Router } from "express";
import ProductManager from "../productManager.js";
import { existsSync, promises, writeFileSync } from 'fs';

const myProducts = new ProductManager();
const router = Router();

let carts = [];
const path = myProducts.path;

if (!existsSync(`${path}/carts.json`)) {
    writeFileSync(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));
}

router.post("/", async (req, res) => {
    try {
        let myFile;
        let { products } = req.body;

        if (!Array.isArray(products)) {
            products = [products];
        }

        const product = products.map((value, key) => ({ [key]: value }));

        if (products.length > 0) {
            myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
            carts = JSON.parse(myFile);
            
            let id = carts.length + 1;
            carts.push({id, products: product});
            await promises.writeFile(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));

            return res.status(201).send({ message: "Product successfully added to cart!" });
        }else{
            return res.status(400).send({ message: "No products to add to cart!" });
        }
    } catch (error) {
        return res.status(500).send('Could not add product to cart.');
    }
});

router.get('/:cid', async (req, res) => {

    let cid = parseInt(req.params.cid);
    let myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
    carts = JSON.parse(myFile);

    const cart = carts.find((cart) => cart.id === cid);

    if (cart) { 
        return res.status(200).send(cart) 
    }else{
        return res.status(400).send({ message: "No products found with this ID" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    

});

export default router;

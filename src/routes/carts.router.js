import { Router } from "express";
import ProductManager from "../productManager.js";
import { existsSync, promises, writeFileSync } from 'fs';

const myProducts = new ProductManager();
const router = Router();

let carts = [];
const path = myProducts.path;

if (!existsSync(`${path}/carts.json`)) {
    const myCart = writeFileSync(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));
}

router.post("/", async (req, res) => {
    try {
        let myFile;
        const { products } = req.body;
        const myProduct = products || [];
        const product = [];
        
        let key = 0;
        for (const value of myProduct) {
            product.push({ [key]: value });
            key++;
        }

        console.log(product);
        
        if (products.length > 0) {
            let products  = product;
            myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
            carts = JSON.parse(myFile);
            
            let id = carts.length + 1;
            carts.push({id, products});
            await promises.writeFile(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));

            return res.status(201).send({ message: "Product successfully added to cart!" });
        }else{
            return res.status(400).send({ message: "No products to add to cart!" });
        }
    } catch (error) {
        console.error(error);
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
        return res.status(400).send({ message: "No products found with this CID" });
    }
});

export default router;

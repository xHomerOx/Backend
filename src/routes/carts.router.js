import { Router } from "express";
import ProductManager from "../productManager.js";
import { promises } from 'fs';

const myProducts = new ProductManager();
const router = Router();

let carts = [];
let products = [];

const path = myProducts.path;

router.post("/", async (req, res) => {
    let myFile;

    try {
        myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
        carts = JSON.parse(myFile);
    } catch (error) {
        console.error(error);
    }

    let id = carts.length + 1;
    
    carts.push({id, products});
    await promises.writeFile(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));
    return carts;
});

router.get('/', (req, res) => {
    res.send(carts);
});

export default router;

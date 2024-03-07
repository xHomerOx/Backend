import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const myProducts = new ProductManager();

router.get('/', async (req, res) => {
    let limit = req.query.limit;

    const products = await myProducts.getProducts(limit);
    res.send(products);
});

router.get('/:pid', async (req, res) => {
    try{
        let pid = parseInt(req.params.pid);

        const products = await myProducts.getProductById(pid);
        res.json(products);
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;

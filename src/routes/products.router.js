import { Router } from "express";
import ProductManager from "../productManager.js";

const myProducts = new ProductManager();
const router = Router();


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

router.post("/", async (req, res) => {

    const { title, description, price, code, stock } = req.body;

    await myProducts.addProducts(req.body);

    if (!title || !description || !price || !code || !stock) return res.status(400).send({error: "Fill the required fields to continue..."});

    res.status(201).send({message: "Product succesfully created!"});
});

export default router;

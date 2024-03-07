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

    const { title, description, price, code, status, stock, category } = req.body;

    await myProducts.addProducts(req.body);

    if (typeof title !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof code !== 'string' || typeof status !== 'boolean' || typeof stock !== 'number' || typeof category !== 'string') return res.status(400).send({error: "Fill the required fields with valid data to continue..."});

    res.status(201).send({message: "Product succesfully created!"});
});

export default router;

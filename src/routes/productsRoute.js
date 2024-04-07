import { Router } from "express";
import ProductManager from "../dao/productManagerFS.js";

const myProducts = new ProductManager('public');
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
        res.status(500).send('Internal Server Error');
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, code, status, stock, category } = req.body;
    try {
        await myProducts.addProducts(req.body);

        if (typeof title !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof code !== 'string' || typeof status !== 'boolean' || typeof stock !== 'number' || typeof category !== 'string') return res.status(400).send({error: "Fill the required fields with valid data to continue..."});
    
        res.status(201).send({message: "Product succesfully created!"});
    }catch(error){
        res.status(403).send({ message: "Code is already in use!" });
    }
});

router.put("/:pid", async (req, res) => {
    let pid = parseInt(req.params.pid);
    let myPid = parseInt(req.body.id);
    
    const myProduct = await myProducts.getProductById(pid);

    try{
        if (!myProduct.id) {
            res.status(403).send({ message: "ID was not found!!!" });
        } else if (myPid === pid || !myPid) {
            await myProducts.updateProduct(pid, req.body);
            res.status(201).send({message: "Product updated succesfully!"});
        } else {
            res.status(403).send({ message: "Updating ID is forbidden!" });
        }
    }catch(error){
        res.status(500).send('Could not update product.');
    }
});

router.delete("/:pid", async (req, res) => {
    let pid = parseInt(req.params.pid);
    const myProduct = await myProducts.getProductById(pid);
    const myPid = myProduct.id;

    try{
        if(myPid === pid) {
            await myProducts.deleteProduct(pid);
            res.status(201).send({message: "Product deleted succesfully!"});
        }else{
            res.status(403).send({ message: "Product with this ID not found!" });
        }
    }catch(error){
        res.status(500).send('Could not delete product.');
    }
});

export default router;

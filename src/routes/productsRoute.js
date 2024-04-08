import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
// import ProductManager from "../dao/productManagerFS.js";
import ProductManager from "../dao/productManagerDB.js";

// const myProducts = new ProductManager('public');
const productsRouter = Router();
const myProducts = new ProductManager();

productsRouter.get('/', async (req, res) => {
    const products = await myProducts.getProducts();
    
    res.send({status: 'success', payload: products});
});

productsRouter.get('/:pid', async (req, res) => {
    try{
        let pid = parseInt(req.params.pid);
        const products = await myProducts.getProductById(pid);

        res.send({status: 'success', payload: products});
    }catch(error){
        res.status(400).send({status: 'error', message: error.message});
    }
});

productsRouter.post("/", uploader.array('thumbnail', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnail = [];
        req.files.forEach((file) => {
            req.body.thumbnail.push(file.filename);
        });
    }

    try {
        const products = await myProducts.addProducts(req.body);

        res.send({status: 'success', payload: products});
    }catch(error){
        res.status(400).send({status: 'error', message: error.message});
    }
});

productsRouter.put("/:pid", uploader.array('thumbnail', 3), async (req, res) => {
    let pid = parseInt(req.params.pid);
    let myPid = parseInt(req.body.id);
    
    if (req.files) {
        req.body.thumbnail = [];
        req.files.forEach((file) => {
            req.body.thumbnail.push(file.filename);
        });
    }

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
        console.log(error);
        res.status(500).send('Could not update product.');
    }
});

productsRouter.delete("/:pid", async (req, res) => {
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

export default productsRouter;

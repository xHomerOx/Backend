import { Router } from "express";
import ProductManager from "../productManager.js";
import { existsSync, promises, writeFileSync } from 'fs';

const myProducts = new ProductManager();
const router = Router();

let carts = [];
const path = myProducts.path;
let quantity = 1;

if (!existsSync(`${path}/carts.json`)) {
    writeFileSync(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));
}

router.post("/", async (req, res) => {
    try {
        let myFile;
        let { products } = req.body;

        products = [];
        
        myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
        carts = JSON.parse(myFile);
        
        let id = carts.length + 1;
        carts.push({ id, products });
        await promises.writeFile(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));

        return res.status(201).send({ message: "Product successfully created in cart!" });
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
        return res.status(400).send({ message: "No cart found with this ID" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    try {
        let myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
        const myCarts = JSON.parse(myFile);

        let myProductsFile = await promises.readFile(`${path}/products.json`, 'utf8');
        const myProducts = JSON.parse(myProductsFile);
        
        const myCart = myCarts.find(cart => cart.id === cartId);
        const myProduct = myProducts.find(product => product.id === productId);
        
        if (myCart && myProduct) {
            const productCheck = myCart.products.find(item => item.product === productId);

            if (productCheck) {
                productCheck.quantity++;
            } else {
                myCart.products.push({ product: productId, quantity: 1 });
            }
            
            await promises.writeFile(`${path}/carts.json`, JSON.stringify(myCarts, null, '\t'));

            return res.status(201).send({ message: "Product successfully added to cart!" });
        }else{
            return res.status(400).send({ message: "Could not find product or cart with this ID" });
        }
    } catch (error) {
        return res.status(500).send('Could not add product to cart.');
    }
});

export default router;

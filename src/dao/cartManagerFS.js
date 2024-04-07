import fs from 'fs';

class CartManager {
    constructor(path, productManager) {
        this.path = path;
        this.productManager = productManager;
    };

    getCarts = async() => {
        try {
            let myFile = await fs.promises.readFile(`${path}/carts.json`, 'utf8');
            carts = JSON.parse(myFile);

        }catch(error) {
            throw error;
        }
    }
}

export default CartManager;

// router.post("/", async (req, res) => {
//     try {
//         let myFile;
//         let { products } = req.body;

//         products = [];
        
//         myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
//         carts = JSON.parse(myFile);
        
//         let id = carts.length + 1;
//         carts.push({ id, products });
//         await promises.writeFile(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));

//         return res.status(201).send({ message: "Product successfully created in cart!" });
//     } catch (error) {
//         return res.status(500).send('Could not add product to cart.');
//     }
// });




// router.post("/:cid/product/:pid", async (req, res) => {
//     const cartId = parseInt(req.params.cid);
//     const productId = parseInt(req.params.pid);

//     try {
//         let myFile = await promises.readFile(`${path}/carts.json`, 'utf8');
//         const myCarts = JSON.parse(myFile);

//         let myProductsFile = await promises.readFile(`${path}/products.json`, 'utf8');
//         const myProducts = JSON.parse(myProductsFile);
        
//         const myCart = myCarts.find(cart => cart.id === cartId);
//         const myProduct = myProducts.find(product => product.id === productId);
        
//         if (myCart && myProduct) {
//             const productCheck = myCart.products.find(item => item.product === productId);

//             if (productCheck) {
//                 productCheck.quantity++;
//             } else {
//                 myCart.products.push({ product: productId, quantity: 1 });
//             }
            
//             await promises.writeFile(`${path}/carts.json`, JSON.stringify(myCarts, null, '\t'));

//             return res.status(201).send({ message: "Product successfully added to cart!" });
//         }else{
//             return res.status(400).send({ message: "Could not find product or cart with this ID" });
//         }
//     } catch (error) {
//         return res.status(500).send('Could not add product to cart.');
//     }
// });
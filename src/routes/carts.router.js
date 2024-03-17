import { Router } from "express";

const router = Router();

const products = [
    {
      id: 1,
      title: "Producto 1",
      description: "Mi producto 1",
      price: 100,
      thumbnail: "prod1.jpg",
      code: "A001",
      stock: 10,
      status: true,
      category: "category1"
    },
    {
      id: 2,
      title: "Producto 2",
      description: "Mi producto 2",
      price: 200,
      thumbnail: "prod2.jpg",
      code: "A002",
      stock: 10,
      status: true,
      category: "category2"
    },
    {
      id: 3,
      title: "Producto 3",
      description: "Mi producto 3",
      price: 300,
      thumbnail: "prod3.jpg",
      code: "A003",
      stock: 10,
      status: true,
      category: "category3"
    },
    {
      id: 4,
      title: "Producto 4",
      description: "Mi producto 4",
      price: 400,
      thumbnail: "prod4.jpg",
      code: "A004",
      stock: 10,
      status: true,
      category: "category4"
    },
    {
      id: 5,
      title: "Producto 5",
      description: "Mi producto 5",
      price: 500,
      thumbnail: "prod5.jpg",
      code: "A005",
      stock: 10,
      status: true,
      category: "category5"
    },
    {
      id: 6,
      title: "Producto 6",
      description: "Mi producto 6",
      price: 600,
      thumbnail: "prod6.jpg",
      code: "A006",
      stock: 10,
      status: true,
      category: "category6"
    },
    {
      id: 7,
      title: "Producto 7",
      description: "Mi producto 7",
      price: 700,
      thumbnail: "prod7.jpg",
      code: "A007",
      stock: 10,
      status: true,
      category: "category7"
    },
    {
      id: 8,
      title: "Producto 8",
      description: "Mi producto 8",
      price: 800,
      thumbnail: "prod8.jpg",
      code: "A008",
      stock: 10,
      status: true,
      category: "category8"
    },
    {
      id: 9,
      title: "Producto 9",
      description: "Mi producto 9",
      price: 900,
      thumbnail: "prod9.jpg",
      code: "A009",
      stock: 10,
      status: true,
      category: "category9"
    },
    {
      id: 10,
      title: "Producto 10",
      description: "Mi producto 10",
      price: 1000,
      thumbnail: "prod10.jpg",
      code: "A010",
      stock: 10,
      status: true,
      category: "category10"
    }
];

quantity = 1;

// router.post("/", async (req, res) => {
//     try {
//         let myFile;
//         let { products } = req.body;

//         let id = carts.length + 1;
//         carts.push({ id, products });
//         await promises.writeFile(`${path}/carts.json`, JSON.stringify(carts, null, '\t'));

//         return res.status(201).send({ message: "Product successfully created in cart!" });
//     } catch (error) {
//         return res.status(500).send('Could not add product to cart.');
//     }
// });


router.get('/', async (req, res) => {
    let pid = parseInt(req.params.cid);

    const cart = products.find((cart) => cart.id === pid);

    if (cart) { 
        return res.status(200).send(cart) 
    }else{
        return res.status(400).send({ message: "No cart found with this ID" });
    }
});

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

export default router;

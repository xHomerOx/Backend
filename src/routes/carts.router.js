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


router.get('/', async (req, res) => {
    res.render(
        "home",
        { products }
    )
});

export default router;

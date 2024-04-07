import { Router } from "express";

const cartsRouter = Router();

cartsRouter.get('/', async (_req, res) => {
    res.render('home', { title: 'Products', products });
});

export { cartsRouter, products };

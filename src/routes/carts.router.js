import { Router } from "express";

const router = Router();

const carts = [];

router.post("/", async (req, res) => {
    const { products } = req.body;

    res.status(201).send({message: "Product succesfully created!"});
});

router.get('/', (req, res) => {
    res.send(carts);
});

export default router;

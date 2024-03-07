import { Router } from "express";

const router = Router();

const carts = [];

router.get('/', (req, res) => {
    res.send(carts);
});

export default router;

import { Router } from "express";
import UserManager from "../dao/userManagerDB.js";

const sessionRouter = Router();
const UserService =  new UserManager();

sessionRouter.get('/:uid', async (req, res) => {
    try {
        const result = await UserService.getUser(req.params.uid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

sessionRouter.post('/register', async (req, res) => {
    try {
        const result = await UserService.addUser(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

sessionRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await UserService.loginUser(email, password);
        res.send({
            status: 'success',
            token: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default sessionRouter;
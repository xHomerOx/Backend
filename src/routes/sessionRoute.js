import { Router } from "express";
import UserManager from "../dao/userManagerDB.js";
import passport from "passport";

const sessionRouter = Router();
const UserService =  new UserManager();

sessionRouter.get('/:uid', (req, res, next) => {

}, async (req, res) => {
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
        const token = await UserService.loginUser(email, password);

        res.cookie('auth', token, { maxAge: 60*60*1000 }).send({
            status: 'success',
            token
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

sessionRouter.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
    res.send({
        user: req.user
    })
});

export default sessionRouter;
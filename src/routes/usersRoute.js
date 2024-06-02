import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import passport from 'passport';
import UserController from "../controllers/userController.js";
import { userService } from "../repositories/index.js";
import { isAdmin } from '../middlewares/guard.js';

const usersRouter = Router();
const myUser = new UserController(userService);

usersRouter.post("/register", passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
    try {
        const result = await myUser.addUser(req.body);
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

usersRouter.post("/login", auth, async (req, res) => {
    try {
        const { user, password } = req.body;
        const token = await myUser.loginUser(user, password);
        
        res.cookie('auth', token.token, { maxAge: 60*60*1000 }).send({
            status: 'success',
            token: token.token,
            user: token.user,
            role: token.role
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

usersRouter.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
    res.send({
        user: {
            user: req.user.user,
            role: req.user.role
        }
    })
});

usersRouter.get('/:uid', passport.authenticate('jwt', {session: false}), isAdmin, async (req, res) => {
    try {
        const result = await myUser.getUser(req.params.uid);
        res.send({
            status: 'success',
            payload: result.payload
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default usersRouter;
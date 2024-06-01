import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import passport from 'passport';
import UserController from "../controllers/userController.js";
import { userService } from "../repositories/index.js";

const usersRouter = Router();
const myUser = new UserController(userService);

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') return next();

    res.status(403).send({
        status: 'error',
        message: 'unauthorized'
    });
}

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

usersRouter.post("/login", auth, passport.authenticate('login', {failureRedirect: '/failLogin'}), async (req, res) => {
    try {
        const { user, password } = req.body;
        const token = await myUser.loginUser(user, password);

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

usersRouter.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
    res.send({
        user: req.user
    })
});

usersRouter.get('/:uid', passport.authenticate('jwt', {session: false}), isAdmin, async (req, res) => {
    try {
        const result = await myUser.getUser(req.params.uid);
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

usersRouter.get('/github'), passport.authenticate('github', {scope: ['user: user']}, async (_req, _res) => {});

usersRouter.get('/github', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default usersRouter;
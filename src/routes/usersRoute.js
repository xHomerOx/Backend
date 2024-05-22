import { Router } from 'express';
import passport from 'passport';
import UserController from '../controllers/userController.js';

const myUsers = new UserController();
const usersRouter = Router();

usersRouter.post("/register", passport.authenticate('register', {failureRedirect: '/failRegister'}), myUsers.addUser);
usersRouter.post("/login", passport.authenticate('login', {failureRedirect: '/failLogin'}), myUsers.getUser);

export default usersRouter;
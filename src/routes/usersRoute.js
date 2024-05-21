import { Router } from 'express';
import userModel from '../models/userModel.js';
import { auth } from '../middlewares/auth.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';
import passport from 'passport';

const usersRouter = Router();

//Me registro y chequeo si el usuario existe o no en la db.
usersRouter.post("/register", passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
    try {
        req.session.failRegister = false;

        const { user, password } = req.body;
        const existingUser = await userModel.findOne({ user: req.body.user });

        let newUser =  {
            user,
            password: createHash(password)
        }

        //Veo si existe o es admincoder.
        if (existingUser || req.body.user === "admincoder@coder.com") {
            req.session.failRegister = true;
            res.redirect("/login");
        } else { 
            req.session.failRegister = false;
            await userModel.create(newUser);
            res.redirect("/login");
        }
    } catch (error) {
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

//Si todo va bien entra si no tira alert, pasando por el Middleware auth para Admin.
usersRouter.post("/login", auth, passport.authenticate('login', {failureRedirect: '/failLogin'}), async (req, res) => {
    try {
        req.session.failLogin = false;

        const { user, password } = req.body;
        const myUser = await userModel.findOne({user: user});

        if (!myUser) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (isValidPassword(myUser, password)) {
            req.session.failLogin = false;
        } else {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        delete myUser.password;
        req.session.user = myUser;

        return res.redirect("/products");
    } catch (error) {
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});

export default usersRouter;
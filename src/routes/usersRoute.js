import { Router } from 'express';
import userModel from '../models/userModel.js';

const usersRouter = Router();

usersRouter.post("/register", async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ user: req.body.user });

        if (existingUser) {
            req.session.failRegister = true;
            return res.redirect("/register");
        } else { 
            req.session.failRegister = false;
            await userModel.create(req.body);
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error.message);
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

usersRouter.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        const result = await userModel.findOne({user: req.body.user});
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (req.body.password !== result.password) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        delete result.password;
        req.session.user = result;

        return res.redirect("/products");
    } catch (error) {
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});

export default usersRouter;
import { Router } from 'express';
import userModel from '../models/userModel.js';
import { auth } from '../middlewares/auth.js';

const usersRouter = Router();

//Me registro y chequeo si el usuario existe o no en la db.
usersRouter.post("/register", async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ user: req.body.user });

        //Veo si existe o es admincoder.
        if (existingUser || req.body.user === "admincoder@coder.com") {
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

//Si todo va bien entra si no tira alert.
usersRouter.post("/login", auth, async (req, res) => {
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
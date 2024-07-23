import { Router } from "express";
import UserManager from "../dao/userManagerDB.js";
import passport from "passport";
import { authenticate } from "../config/authenticationConfig.js";

const sessionRouter = Router();
const UserService =  new UserManager();

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') return next();

    res.status(403).send({
        status: 'error',
        message: 'unauthorized'
    });
}

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

sessionRouter.get('/:uid', passport.authenticate('jwt', {session: false}), isAdmin, async (req, res) => {
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

sessionRouter.get('/', authenticate, async (req, res) => {
    const user = req.session.user;
    const roles = ['user', 'premium'];
    
    if (user.role === 'premium' || user.role === 'user') {
        res.render('switchRoleView', { title: 'Role Switcher', user: user, role: roles });
    }else{
        res.status(401).json({ error: 'Unauthorized', message: 'You do not have permission to access this page.' });
    }
});

sessionRouter.put('/', async (req, res) => {
    const user = req.session.user;
    const newRole = req.body.role;

    try {
      await UserService.updateRole(user, newRole);
      res.status(200).send("Role updated successfully!");
    } catch (error) {
      res.status(500).send("Error updating role!");
    }
  });

export default sessionRouter;
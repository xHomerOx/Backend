import { Router } from "express";
import passport from "passport";

const sessionsRouter = Router();

sessionsRouter.get('/github'), passport.authenticate('github', {scope: ['user: user']}, async (_req, _res) => {});

sessionsRouter.get('/github', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

export default sessionsRouter;
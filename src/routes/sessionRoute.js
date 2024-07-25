import { Router } from "express";
import UserManager from "../dao/userManagerDB.js";
import passport from "passport";
import { authenticate } from "../config/authenticationConfig.js";
import { uploader } from "../utils/multerUtil.js";

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

sessionRouter.get('/premium/:uid', authenticate, async (req, res) => {
    const user = await UserService.getUser(req.params.uid);
    const roles = ['user', 'premium'];
    
    if (user.role === 'premium') {
        res.render('switchRoleView', { title: 'Role Switcher', user: user, role: roles });
    }else{
        res.status(401).json({ error: 'Unauthorized', message: 'You do not have permission to access this page.' });
    }
});

sessionRouter.put('/premium/:uid', async (req, res) => {
    const uid = req.params.uid;
    const newRole = req.body.role;
    const documents = [];

    try {
      await UserService.updateRole(uid, newRole, documents);
      res.status(200).send("Role updated successfully!");
    } catch (error) {
      res.status(500).send("Error updating role!");
    }
});

sessionRouter.get('/:uid/documents', (req, res) => {
    const user = req.session.user;
    const userId = req.params.uid;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'You do not have permission to access this page.' });
    }

    if (user.role === 'premium') {
        return res.status(400).json({ error: 'You cannot upgrade anymore', message: 'You are Premium User now.' });
    }

    res.render('documentsView', { title: 'Documents Uploader', user: user, userId: userId });  
});

sessionRouter.post('/:uid/documents', uploader, async (req, res) => {
    const user = req.session.user;
    const newRole = 'premium';
    
    if (req.files) {
        let uploadedDocs = {};
        
        uploadedDocs.idDocument = req.files.idDocument[0].filename;
        uploadedDocs.addressDocument = req.files.addressDocument[0].filename;
        uploadedDocs.statementDocument = req.files.statementDocument[0].filename;

        const profileImage = req.files.profileImage[0].filename;
        const productImage = req.files.productImage[0].filename;

        const documents = [
            { name: uploadedDocs.idDocument, reference: `/public/img/documents/${uploadedDocs.idDocument}` },
            { name: uploadedDocs.idDocument, reference: `/public/img/documents/${uploadedDocs.addressDocument}` },
            { name: uploadedDocs.idDocument, reference: `/public/img/documents/${uploadedDocs.statementDocument}` }
        ];

        await UserService.updateRole(user, newRole, documents);
        return res.status(200).json({ message: 'Documents uploaded successfully. User upgraded to premium.', uploadedDocs, profileImage, productImage });
    }else{
        return res.status(400).json({ error: 'Bad Request', message: 'No documents were uploaded.' });
    }
});

export default sessionRouter;
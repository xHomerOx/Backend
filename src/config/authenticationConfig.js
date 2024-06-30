export const authenticate = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'You must be logged in to access this page.' });
    }
    next();
};
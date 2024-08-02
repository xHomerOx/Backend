import passport from "passport";

passport.authenticate('jwt', { session: false });

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin' || req.user && req.user.role === 'premium') {
    next();
  } else {
    res.status(403).send({
      status: 'error',
      message: 'Unauthorized'
    });
  }
};

export const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send({
      status: 'error',
      message: 'unauthorized to chat without logging in'
    });
  }
};
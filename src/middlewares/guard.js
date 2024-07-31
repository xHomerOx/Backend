import passport from "passport";

passport.authenticate('jwt', { session: false });

export const isAdmin = (req, res, next) => {
  console.log('User:', req.user);
  if (req.user && req.user.role === 'admin') {
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
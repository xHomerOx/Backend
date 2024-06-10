import passport from "passport";

export const isAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user || user.role !== 'admin') {
      res.status(403).send({
        status: 'error',
        message: 'Unauthorized'
      });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
}

export const isLoggedIn = (req, res, next) => {
  passport.authenticate('jwt', { session: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).send({
        status: 'error',
        message: 'unauthorized to chat without logging in'
      });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
}
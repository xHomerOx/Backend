import passport from "passport";

export const auth = function (req, res, next) {
  passport.authenticate('jwt', { session: true }, (err, user) => {

    if (err) {
      return next(err);
    }

    if (!user) {
      return next();
    }

    req.user = user;

    next();
  })(req, res, next);
}
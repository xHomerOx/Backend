export const auth = function (req, res, next) {
  const { user } = req.body;

  if (req.user && req.user.role === 'admin' && req.path !== '/') {
    req.session.user = user;
    req.session.admin = true;
    
    res.json({
      status: 'success',
      user: user,
      admin: true
    });
  } else {
    return next();
  }
}
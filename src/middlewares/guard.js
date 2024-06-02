export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    
    res.status(403).send({
      status: 'error',
      message: 'unauthorized'
    });
}

export const isLoggedIn = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({
      status: 'error',
      message: 'unauthorized to chat without logging in'
    });
  }
}
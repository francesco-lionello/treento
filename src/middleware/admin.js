function admin(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
}

module.exports = admin;
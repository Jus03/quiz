function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    if (req.originalUrl !== '/login' && req.originalUrl !== '/signup' && req.originalUrl !== '/logout') {
      return res.redirect('/login');
    }
    next();
  }
  
  module.exports = { ensureAuthenticated };
  
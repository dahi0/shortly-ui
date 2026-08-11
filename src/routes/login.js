const { db, User } = require("../db.js");

module.exports = [
  {
    method: 'GET',
    path: '/login',
    handler: (req, h) => {
      return h.view('login', {
        error: false
      });
    }
  },
  {
    method: 'POST',
    path: '/login',
    handler: async(req, h) => {
      const u = await User.findOne({
        where: {
          email: req.payload.email
        }
      });
      if (u == null) return h.view('login', {
        error: true,
        errMessage: 'user not found'
      });
      if (!(await u.validPassword(req.payload.password))) return h.view('login', {
        error: true,
        errMessage: 'invalid password'
      });
      req.cookieAuth.set({ id: u.id });
      return h.redirect('/');
    }
  }
];

const J = require("joi");
const { db, User } = require("../db.js");

module.exports = [
  {
    method: 'GET',
    path: '/signup',
    options: {
      auth: false
    },
    handler: (req, h) => {
      return h.view('signup', {
        error: false
      });
    }
  },
  {
    method: 'POST',
    path: '/signup',
    options: {
      auth: false,
      validate: {
        payload: J.object({
          name: J.string().min(3).max(10).required(),
          email: J.string().email().required(),
          password: J.string().min(8).max(100).required()
        }),
        failAction: async(req, h, err) => {
          return h.view('signup', {
            error: true,
            errMessage: 'invalid credentials'
          }).takeover();
        }
      }
    },
    handler: async(req, h) => {
      let u = await User.findOne({
        where: {
          email: req.payload.email
        }
      });
      if (u != null) return h.view('signup', {
        error: true,
        errMessage: `a user with the email ${req.payload.email} already exists`
      });
      u = await User.create({
        name: req.payload.name,
        email: req.payload.email,
        password: req.payload.password
      });
      req.cookieAuth.set({
        id: u.id
      });
      return h.redirect('/');
    }
  }
];

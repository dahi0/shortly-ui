const J = require("joi");
const { db, User, Link } = require("../db.js");

const auth = { mode: 'required' };

module.exports = [
  {
    method: 'GET',
    path: '/new',
    options: { auth },
    handler: (req, h) => {
      return h.view('new', {
        error: false
      });
    }
  },
  {
    method: 'POST',
    path: '/new',
    options: {
      auth,
      validate: {
        payload: J.object({
          url: J.string().uri().required()
        })
      }
    },
    handler: async(req, h) => {
      const u = req.auth.credentials;
      const link = await Link.create({
        url: req.payload.url,
        visits: 0,
        ownerID: u.id
      });
      return h.redirect('/');
    }
  }
];

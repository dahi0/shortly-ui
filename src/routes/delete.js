const { db, Link } = require("../db.js");

module.exports = [
  {
    method: '*',
    path: '/delete/{id}',
    options: {
      auth: { mode: 'required' }
    },
    handler: async(req, h) => {
      const u = req.auth.credentials;
      await Link.destroy({
        where: { id: req.params.id, ownerID: u.id }
      });
      return h.redirect('/');
    }
  }
];

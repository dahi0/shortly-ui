const { db, User, Link } = require("../db.js");

module.exports = [
  {
    method: 'GET',
    path: '/',
    options: {
      auth: { mode: 'required' }
    },
    handler: async (req, h) => {
      const u = req.auth.credentials;
      const links = await Link.findAll({
        where: { ownerID: u.id },
        order: [['createdAt', 'DESC']]
      });
      return h.view('index', {
        links
      });
    }
  }
];

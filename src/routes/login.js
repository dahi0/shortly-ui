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
];

const ejs = require("ejs");
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Cookie = require("@hapi/cookie");
const { db, User } = require("./db.js");
const login  = require("./route/login.js");
const signup = require("./routes/signup.js");

const app = Hapi.Server({
  port: process.env.PORT || 3000
});

const run = async() => {
  await app.register(Inert);
  await app.register(Vision);
  await app.register(Cookie);
  console.log(process.env);
  app.auth.strategy('session', 'cookie', {
    cookie: {
      name: process.env.AUTH_NAME,
      password: process.env.AUTH_PASSWORD,
      isSecure: process.env.MODE == "production"
    },
    redirectTo: '/signup',
    validate: async(req, s) => {
      const u = await User.findOne({
        where: { id: s.id }
      });
      if (!u) return { isValid: false };
      return { isValid: true, credentials: u };
    }
  });
  app.auth.default('session');

  app.views({
    engines: { ejs },
    relativeTo: __dirname,
    path: 'ui'
  });

  app.route({
    method: 'GET',
    path: '/',
    handler: async(req, h) => {
      return { a: req.auth.credentials };
    },
    options: {
      auth: { mode: 'required' }
    }
  });

  app.route({
    method: 'GET',
    path: '/app.css',
    handler: {
      file: __dirname + '/ui/app.css',
    }
  });

  app.route({
    method: 'GET',
    path: '/users',
    handler: async(req, h) => {
      return await User.findAll();
    }
  });
  app.route({
    method: 'GET',
    path: '/links',
    handler: async(req, h) => {
      return await Link.findAll();
    }
  });

  app.route(login[0]);
  app.route(login[1]);
  app.route(signup[0]);
  app.route(signup[1]);

  await app.start();
  console.log("app started...");
}

run();

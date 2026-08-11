const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const db = new Sequelize(process.env.DB_URL);


const User = db.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100]
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Link = db.define("links", {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    isUrl: true,
    allowNull: false
  },
  visits: DataTypes.INTEGER
});

User.hasMany(Link, {
  foreignKey: "ownerID",
  onDelete: "CASCADE"
});

Link.belongsTo(User, {
  foreignKey: "ownerID"
});

module.exports = { db, User, Link };

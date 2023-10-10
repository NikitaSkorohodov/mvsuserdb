const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('users', {
  UserID: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  UserName: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  Email: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  PasswordHash: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Users',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "UserID" },
      ]
    },
  ]
});

module.exports = User;

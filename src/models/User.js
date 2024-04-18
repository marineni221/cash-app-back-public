"use strict";

require('dotenv').config();

const { DataTypes } = require("sequelize");
const Role = require("./Role");
const Company = require('./Company');
const sequelize = require('./init_db');
const Account = require('./Account');

const User = sequelize.define("User", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: null,
  },
},
{
  sequelize,
  modelName: "User",
  underscored: true,
});

// =================================================================
                    /** RelationShip */

User.hasMany(Account, {
  as: "accounts",
});

Account.belongsTo(User, {as: "user"});

// User.hasOne(Role, {
//   as: "role",
// });

// User.belongsTo(Company, {
//   as: "company",
// });

// =================================================================

module.exports = User;

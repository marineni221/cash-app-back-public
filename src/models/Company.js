"use strict";

const { Model, Sequelize, DataTypes } = require("sequelize");
const User = require("./User");
const sequelize = require("./init_db");

const Company = sequelize.define(
  "Company",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ninea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    business_sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contract: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_type: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Company",
    underscored: true,
  }
);

// =================================================================
                    /** RelationShip */

// Company.hasMany(User, {
//   foreignKey: "user_id",
//   as: "users",
// });

// =================================================================

module.exports = Company;
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./init_db");
const Account = require("./Account");

class PersonalAccessToken extends Model {}

PersonalAccessToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "accounts",
        },
        key: "id",
      },
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PersonalAccessToken",
    underscored: true,
  }
);

PersonalAccessToken.belongsTo(Account, {as: "account"});
Account.hasMany(PersonalAccessToken, {as: "tokens"});

module.exports = PersonalAccessToken;
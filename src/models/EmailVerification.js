"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init_db');

class EmailVerification extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

EmailVerification.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "EmailVerification",
    underscored: true,
  }
);

module.exports = EmailVerification;

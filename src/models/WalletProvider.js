"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./init_db");
const Payment = require("./Payment");

class WalletProvider extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

WalletProvider.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: "WalletProvider",
    underscored: true,
  }
);

Payment.belongsTo(WalletProvider, {as: "walletProvider"});
WalletProvider.hasMany(Payment, {as: "payments"});

module.exports = WalletProvider;

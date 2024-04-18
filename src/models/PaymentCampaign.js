"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init_db');

class PaymentCampaign extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

PaymentCampaign.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispatch_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("canceled", "inprogress", "pause"),
      allowNull: false,
      defaultValue: 'inprogress',
    },
    dispatch_type: {
      type: DataTypes.ENUM("wallet", "code", "hybrid"),
      allowNull: false,
    },
    wallet_provider: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: null,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'accounts',
        },
        key: 'id',
      }
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
    modelName: "PaymentCampaign",
    underscored: true,
  }
);

module.exports = PaymentCampaign;

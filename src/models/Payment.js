"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./init_db");
const PaymentCampaign = require("./PaymentCampaign");
const WalletProvider = require("./WalletProvider");

class Payment extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Payment.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      allowNull: false,
    },
    wallet_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "wallet_providers",
        },
        key: "id",
      },
    },
    payment_campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "payment_campaigns",
        },
        key: "id",
      },
    },
    reference: {
      type: DataTypes.STRING(22),
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
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
    },
  },
  {
    sequelize,
    modelName: "Payment",
    underscored: true,
  }
);

Payment.belongsTo(PaymentCampaign, {as: "paymentCampaign"});
PaymentCampaign.hasMany(Payment, {as: "payments"});

module.exports = Payment;

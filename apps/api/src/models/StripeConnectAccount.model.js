import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const StripeConnectAccount = sequelize.define(
  "StripeConnectAccount",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    stripe_account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    charges_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    payouts_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    account_status: {
      type: DataTypes.ENUM("PENDING", "ACTIVE", "RESTRICTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "stripe_connect_accounts",
    timestamps: true,
    underscored: true,
  }
);

export default StripeConnectAccount;

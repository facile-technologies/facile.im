import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProductPurchase = sequelize.define(
  "ProductPurchase",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    seller_user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    buyer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buyer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ISO 3166-1 alpha-2 country code derived from buyer IP at checkout time
    buyer_country: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    // Effective price charged (after sale_price applied if any)
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // Facile's platform fee in the same currency
    platform_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // What the seller actually receives (amount - platform_fee)
    seller_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "usd",
    },
    stripe_session_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    stripe_payment_intent_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "REFUNDED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "product_purchases",
    timestamps: true,
    underscored: true,
  }
);

export default ProductPurchase;

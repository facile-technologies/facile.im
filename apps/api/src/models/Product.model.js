import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const Product = sequelize.define(
  "Product",
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
    },
    type: {
      type: DataTypes.ENUM("DIGITAL", "EXTERNAL"),
      allowNull: false,
      defaultValue: "DIGITAL",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "USD",
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    is_on_sale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cta_text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Buy Now",
    },
    success_heading: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Thank you for your purchase",
    },
    success_subheading: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Hope you enjoy the product!",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    underscored: true,
  }
);

export default Product;

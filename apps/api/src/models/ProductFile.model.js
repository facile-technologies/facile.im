import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProductFile = sequelize.define(
  "ProductFile",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("FILE", "LINK"),
      allowNull: false,
      defaultValue: "FILE",
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING, // e.g. "1.2 MB"
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_files",
    timestamps: false,
    underscored: true,
  }
);

export default ProductFile;

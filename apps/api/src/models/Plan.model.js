import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const Plan = sequelize.define(
  "Plan",
  {
     id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ❌ WAS: DataTypes.ARRAY(DataTypes.STRING)  (not supported in MySQL)
    // ✅ NOW: JSON, still called "features"
    features: {
      type: DataTypes.JSON,       // or DataTypes.TEXT if you prefer manual stringify/parse
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updatedAt",
    },
  },
  {
    tableName: "plans",
    timestamps: true, // uses createdAt / updatedAt
  }
);

export default Plan;

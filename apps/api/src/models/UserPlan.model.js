import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UserPlan = sequelize.define(
  "UserPlan",
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
    plan_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    stripe_session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "ACTIVE", "CANCELED", "EXPIRED", "PAST_DUE"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: "user_plans",
    timestamps: true,
    underscored: true,
  }
);

export default UserPlan;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UserAnalytics = sequelize.define(
  "UserAnalytics",
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
    
    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

        analytics_date: {
         type: DataTypes.DATEONLY,
        allowNull: false,
      },

    views_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      clicks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      interactions_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      engagement_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
  },
  {
    tableName: "user_analytics",
    timestamps: true,
    underscored: true,
    indexes: [
      // ✅ Prevents two rows for same profile on same day
      { unique: true, fields: ["user_profile_id", "analytics_date"] },
    ],
  }
);

export default UserAnalytics;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UserAnalyticsHourly  = sequelize.define(
  "UserAnalyticsHourly",
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



      // ✅ Correct approach
analytics_hour_utc: {
  type: DataTypes.DATE,   // stores full UTC datetime e.g. "2026-04-08 09:00:00 UTC"
  allowNull: false,
},


    // Kept for convenience — always derive from analytics_hour_utc, never set manually
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
    tableName: "user_analytics_hourly",
    timestamps: true,
    underscored: true,
     indexes: [
  { unique: true, fields: ["user_profile_id", "analytics_hour_utc"] }
]
  }
);

export default UserAnalyticsHourly;

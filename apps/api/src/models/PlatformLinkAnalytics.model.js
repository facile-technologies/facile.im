import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PlatformLinkAnalytics = sequelize.define(
  "PlatformLinkAnalytics",
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

    profile_link_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

        analytics_date: {
         type: DataTypes.DATEONLY,
        allowNull: false,
      },

    
      clicks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      
  },
  {
    tableName: "platform_link_analytics",
    timestamps: true,
    underscored: true,
    indexes: [
      // ✅ Prevents two rows for same profile on same day
      { unique: true, fields: ["user_profile_id", "analytics_date","profile_link_id"],name: 'platform_link_analytics_profile_id_date_link_id' },
      
    ],
  }
);

export default PlatformLinkAnalytics;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UserAnalyticsSource  = sequelize.define(
  "UserAnalyticsSource",
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


     // "instagram", "facebook", "direct", "twitter", "whatsapp", "other"
    source: {
      type: DataTypes.ENUM(
        "instagram",
        "facebook",
        'linkedin',
        "tiktok" ,
        'snapchat',
        'pinterest',
        "x",
        "whatsapp",
        "direct",
        "other"
      ),
      allowNull: false,
    },

        analytics_date: {
         type: DataTypes.DATEONLY,
        allowNull: false,
      },

      analytics_hour_utc: {
  type: DataTypes.DATE,   // stores full UTC datetime e.g. "2026-04-08 09:00:00 UTC"
  allowNull: false,
},

    views_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // clicks_count: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
      // interactions_count: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
      // engagement_rate: {
      //   type: DataTypes.DECIMAL(5, 2),
      //   allowNull: false,
      //   defaultValue: 0.00,
      // },
  },
  {
    tableName: "user_analytics_sources",
    timestamps: true,
    underscored: true,
   
    indexes: [
      // ✅ One row per profile per source per hour
      { unique: true, fields: ["user_profile_id", "analytics_hour_utc", "source"] },
      // ✅ Fast daily queries
      { fields: ["user_profile_id", "analytics_date"] },
    ],
  }
);

export default UserAnalyticsSource;

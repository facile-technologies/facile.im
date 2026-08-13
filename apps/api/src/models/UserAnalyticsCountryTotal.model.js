import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UserAnalyticsCountryTotal = sequelize.define(
  "UserAnalyticsCountryTotal",
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

    
  
    country_code: {
      type: DataTypes.STRING(2),
      allowNull: false,
      comment: "ISO 3166-1 alpha-2 country code",
    },

    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      total_views_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
       total_clicks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
  },
  {
    tableName: "user_analytics_country_total",
    timestamps: true,
    underscored: true,
  }
);

export default UserAnalyticsCountryTotal;

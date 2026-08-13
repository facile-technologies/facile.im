import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const RecentActivities = sequelize.define(
  "RecentActivities",
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

      
  
    activity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  {
    tableName: "recent_activities",
    timestamps: true,
    underscored: true,
  }
);

export default RecentActivities;

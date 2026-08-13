import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const Team = sequelize.define(
  "Team",
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



    team_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    team_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

     total_members: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
  

      team_status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
   
    
  },
  {
    tableName: "teams",
    timestamps: true,
    underscored: true,
  }
);

export default Team;

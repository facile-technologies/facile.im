import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const Template = sequelize.define(
  "Template",
  {
     id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    
    
    template_name: {
          type: DataTypes.STRING,
          allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    
  

     is_template_locked:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    
        team_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

     is_default:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },


  
    
     
  },
  {
    tableName: "templates",
    timestamps: true,
    underscored: true,
  }
);

export default Template;

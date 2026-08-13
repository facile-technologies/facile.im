import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PlatformLink = sequelize.define(
  "PlatformLink",
  {
     id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    default_icon: {
  type: DataTypes.TEXT('long'), 
  allowNull: true,
},
    black_icon: {
       type: DataTypes.TEXT('long'), 
  allowNull: true,
    },
    stroked_icon: {
       type: DataTypes.TEXT('long'), 
  allowNull: true,
    },
    colored_icon: {
       type: DataTypes.TEXT('long'), 
  allowNull: true,
    },
    white_icon: {
      type: DataTypes.TEXT('long'), 
  allowNull: true,
    },
  },
  {
    tableName: "platform_link",
    timestamps: false,
  }
);

export default PlatformLink;

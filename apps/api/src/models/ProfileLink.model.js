import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileLink = sequelize.define(
  "ProfileLink",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    platform_link_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }, 
    user_profile_id: {
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "profile_links",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileLink;

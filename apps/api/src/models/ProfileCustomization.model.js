import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileCustomization = sequelize.define(
  "ProfileCustomization",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_profile_id: {
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about_text_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    font_family: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    font_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    background_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    background_blur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    layout: {
      type: DataTypes.ENUM("DEFAULT", "LIST", "CARD"),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "profile_customizations",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileCustomization;

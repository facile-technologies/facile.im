import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileContact = sequelize.define(
  "ProfileContact",
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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    layout: {
      type: DataTypes.ENUM("COMPACT", "CARD"),
      allowNull: false,
      defaultValue: "COMPACT",
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    button_text: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Connect",
    },
    button_corner_radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    button_bg_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    button_text_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    success_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "profile_contacts",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileContact;

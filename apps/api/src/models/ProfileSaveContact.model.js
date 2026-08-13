import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileSaveContact = sequelize.define(
  "ProfileSaveContact",
  {
   id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "profile_save_contacts",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileSaveContact;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileMediaCustomization = sequelize.define(
  "ProfileMediaCustomization",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    layout: {
      type: DataTypes.ENUM("CARDS", "CAROUSAL"),
      allowNull: false,
      defaultValue: "CAROUSAL",
    },
  },
  {
    tableName: "profile_media_customization",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileMediaCustomization;

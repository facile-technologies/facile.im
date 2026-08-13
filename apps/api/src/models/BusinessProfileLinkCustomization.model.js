import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const BusinessProfileLinkCustomization = sequelize.define(
  "BusinessProfileLinkCustomization",
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
    icon_styled: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    layout: {
      type: DataTypes.ENUM("ICONS", "CAROUSAL", "CARDS"),
      allowNull: false,
      defaultValue: "ICONS",
    },
    background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Business_profile_link_customization",
    timestamps: false,
    underscored: true,
  }
);

export default BusinessProfileLinkCustomization;

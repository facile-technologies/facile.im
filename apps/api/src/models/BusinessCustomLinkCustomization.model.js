// models/BusinessCustomLinkCustomization.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const BusinessCustomLinkCustomization = sequelize.define(
  "BusinessCustomLinkCustomization",
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

    // Customization settings for ALL custom links
    layout: {
      type: DataTypes.ENUM("CAROUSAL", "CARDS", "GRID", "ICONS"),
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
  },
  {
    tableName: "Business_custom_link_customization",
    timestamps: false,
    underscored: true,
  }
);

export default BusinessCustomLinkCustomization;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const QrCustomization = sequelize.define(
  "QrCustomization",
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
    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo_size: {
      type: DataTypes.ENUM("Standard", "Small"),
      allowNull: false,
      defaultValue: "Standard",
    },
    logo_shape: {
      type: DataTypes.ENUM("Round", "Square"),
      allowNull: false,
      defaultValue: "Round",
    },
    text_content: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Scan Me",
    },
    text_position: {
      type: DataTypes.ENUM("Top", "Bottom", "None"),
      allowNull: false,
      defaultValue: "Top",
    },
    qr_color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#000000",
    },
    bg_color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#FFFFFF",
    },
    is_gradient: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "qr_customizations",
    timestamps: true,
    underscored: true,
  }
);

export default QrCustomization;

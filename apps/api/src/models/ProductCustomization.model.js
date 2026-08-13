import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProductCustomization = sequelize.define(
  "ProductCustomization",
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
    layout: {
      type: DataTypes.ENUM("CAROUSAL", "CARDS"),
      allowNull: false,
      defaultValue: "CAROUSAL",
    },
    main_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#FFFFFF",
    },
    button_bg_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#000000",
    },
    button_text_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#FFFFFF",
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_customizations",
    timestamps: true,
    underscored: true,
  }
);

export default ProductCustomization;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const StorefrontProfile = sequelize.define(
  "StorefrontProfile",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    store_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    button_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tile_bg_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    theme: {
      type: DataTypes.ENUM("LIGHT", "DARK", "CUSTOM"),
      allowNull: false,
      defaultValue: "LIGHT",
    },
    show_reviews: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_contact_form: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "storefront_profiles",
    timestamps: false,
    underscored: true,
  }
);

export default StorefrontProfile;

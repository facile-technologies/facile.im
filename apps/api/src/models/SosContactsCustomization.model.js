import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const SosContactsCustomization = sequelize.define(
  "SosContactsCustomization",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    profile_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    title_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    header_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    body_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contact_btn_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "sos_contacts_customizations",
    timestamps: false,
    underscored: true,
  }
);

export default SosContactsCustomization;

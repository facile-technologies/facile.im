import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const SosMedicalCustomization = sequelize.define(
  "SosMedicalCustomization",
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
    header_text: {
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
  },
  {
    tableName: "sos_medical_customizations",
    timestamps: false,
    underscored: true,
  }
);

export default SosMedicalCustomization;

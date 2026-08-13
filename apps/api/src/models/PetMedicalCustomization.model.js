import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PetMedicalCustomization = sequelize.define(
  "PetMedicalCustomization",
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
    medical_detail_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    tableName: "pet_medical_customizations",
    timestamps: false,
    underscored: true,
  }
);

export default PetMedicalCustomization;

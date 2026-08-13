import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PetMedicalDetail = sequelize.define(
  "PetMedicalDetail",
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
    disease_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disease_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
      sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

  },
  {
    tableName: "pet_medical_details",
    timestamps: true,
    underscored: true,
  }
);

export default PetMedicalDetail;

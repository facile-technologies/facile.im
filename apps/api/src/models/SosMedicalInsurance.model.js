import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const SosMedicalInsurance = sequelize.define(
  "SosMedicalInsurance",
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
    insurance_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insurance_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "sos_medical_insurances",
    timestamps: true,
    underscored: true,
  }
);

export default SosMedicalInsurance;

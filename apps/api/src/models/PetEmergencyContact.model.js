import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PetEmergencyContact = sequelize.define(
  "PetEmergencyContact",
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

    contact_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    whatsapp_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "pet_emergency_contacts",
    timestamps: false,
    underscored: true,
  }
);

export default PetEmergencyContact;

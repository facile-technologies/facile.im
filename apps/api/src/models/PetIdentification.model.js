import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PetIdentification = sequelize.define(
  "PetIdentification",
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

    chipped: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    collar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    special_feature: {
      type: DataTypes.STRING,
      allowNull: true,
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
    layout: { 
      type: DataTypes.ENUM("DEFAULT", "LIST", "CARD"), 
      allowNull: true, },
  },
  {
    tableName: "pet_identification",
    timestamps: false,
    underscored: true,
  }
);

export default PetIdentification;

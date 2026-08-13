import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PetProfile = sequelize.define(
  "PetProfile",
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
    pet_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    important_note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note_is_pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "pet_profiles",
    timestamps: false,
    underscored: true,
  }
);

export default PetProfile;

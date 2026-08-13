import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PetAddress = sequelize.define(
  "PetAddress",
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

    address_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    street_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    house_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    zipcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    city: {
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
    tableName: "pet_addresses",
    timestamps: false,
    underscored: true,
  }
);

export default PetAddress;

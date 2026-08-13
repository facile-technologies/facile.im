import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileType = sequelize.define(
  "ProfileType",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "PERSONAL",
        "BUSINESS",
        "PET",
        "SOS",
        "STORE_FRONT"
      ),
      unique: true,
    },
    category: {
      type: DataTypes.ENUM("NETWORK", "RESCUE_ID", "STORE_FRONT"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "profile_types",
    timestamps: false,
  }
);

export default ProfileType;

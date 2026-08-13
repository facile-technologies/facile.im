// models/TempUser.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const TempUser = sequelize.define(
  "TempUser",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    profile_type: {
      type: DataTypes.ENUM(
        "PERSONAL",
        "BUSINESS",
        "PET",
        "SOS",
        "STORE_FRONT"
      ),
      allowNull: true,
      defaultValue: "PERSONAL",
    },

    otp_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    last_otp_sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "temp_users",
    timestamps: true,
    underscored: true,
  }
);

export default TempUser;

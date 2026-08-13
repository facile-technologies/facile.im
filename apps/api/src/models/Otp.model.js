import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const Otp = sequelize.define(
  "Otp",
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
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp_type: {
      type: DataTypes.ENUM("REGISTRATION", "FORGOT", "LOGIN", "ACTIVATION_CODE"),
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SCANNED", "COMPLETED"),
      allowNull: true,
      defaultValue: "PENDING",
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "otps",
    timestamps: false,
    underscored: true,
  }
);

export default Otp;

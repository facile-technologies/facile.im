import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "USER"),
      allowNull: false,
      defaultValue: "USER",
    },
    profile_type: {
      type: DataTypes.ENUM(
        "PERSONAL",
        "BUSINESS",
        "PET",
        "SOS",
        "STORE_FRONT"
      ),
      allowNull: false,
      defaultValue: "PERSONAL",
    },
    plan_id: {
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM("LOCAL", "GOOGLE", "APPLE", "FACEBOOK", "GITHUB"),
      allowNull: false,
      defaultValue: "LOCAL",
    },
    provider_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verfied: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    is_team_owner:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;

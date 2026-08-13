import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const PersonalProfile = sequelize.define(
  "PersonalProfile",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_username_update: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "personal_profiles",
    timestamps: false,
    underscored: true,
  }
);

export default PersonalProfile;

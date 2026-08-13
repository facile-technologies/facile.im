import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UserProfile = sequelize.define(
  "UserProfile",
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
    profile_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    profile_type_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("OWNER", "ADMIN", "EDITOR", "VIEWER"),
      allowNull: false,
      defaultValue: "OWNER",
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

     template_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
      is_template_assigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    team_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    // if it's a template profile
    is_template_profile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_profiles",
    timestamps: false,
    underscored: true,
  }
);

export default UserProfile;

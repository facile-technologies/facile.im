import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileContactSubmission = sequelize.define(
  "ProfileContactSubmission",
  {
   id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    submitted_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "profile_contact_submissions",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileContactSubmission;

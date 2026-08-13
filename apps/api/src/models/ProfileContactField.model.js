import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileContactField = sequelize.define(
  "ProfileContactField",
  {
  id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    profile_contacts_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    field_type: {
      type: DataTypes.ENUM(
        "EMAIL",
        "PHONE_NUMBER",
        "NAME",
        "LOCATION",
        "CUSTOM"
      ),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "profile_contact_fields",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileContactField;

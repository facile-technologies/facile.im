import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const UniqueCode = sequelize.define(
  "UniqueCode",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },

    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "user_profiles",
        key: "id",
      },
      onDelete: "SET NULL",
    },

    // 🧩 Device identifier (S, K, C, ...)
    device_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "Device type code (e.g. S=Sticker, K=Keychain)",
    },

    device_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    brand: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "PRODUCED",
        "ASSIGNED",
        "UNASSIGNED",
        "ACTIVATED",
        "DEACTIVATED"
      ),
      allowNull: false,
      defaultValue: "PRODUCED",
    },

    activation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: "Date when NFC was mapped",
    },

    is_export: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    one_share_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    one_share_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "unique_codes",
    timestamps: true,
    underscored: true,

    indexes: [
      { unique: true, fields: ["code"] },
      { fields: ["user_id"] },
      { fields: ["user_profile_id"] },
      { fields: ["status"] },
      { fields: ["device_type"] },
    ],
  }
);

export default UniqueCode;

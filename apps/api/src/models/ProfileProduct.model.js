import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const ProfileProduct = sequelize.define(
  "ProfileProduct",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "profile_products",
    timestamps: false,
    underscored: true,
  }
);

export default ProfileProduct;

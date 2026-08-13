import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

// Records each time a product card is rendered on a public profile.
// Used for analytics: views, conversion rate, geographic breakdown.
const ProductView = sequelize.define(
  "ProductView",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    // Denormalised for fast seller-scoped analytics queries
    seller_user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    // ISO 3166-1 alpha-2 country code derived from buyer IP
    buyer_country: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    // Raw IP — used for deduplication; max 45 chars covers IPv6
    buyer_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    tableName: "product_views",
    timestamps: true,
    updatedAt: false, // only created_at needed; no updates ever happen
    underscored: true,
  }
);

export default ProductView;

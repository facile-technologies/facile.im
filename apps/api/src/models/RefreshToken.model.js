import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

// One row per issued refresh token. We never store the raw token — only its
// SHA-256 hash (`token_hash`). `family_id` links a rotation lineage so that
// presenting an already-rotated/revoked token can revoke the entire family
// (reuse detection). See utils/refreshTokens.js.
const RefreshToken = sequelize.define(
  "RefreshToken",
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
    token_hash: {
      type: DataTypes.STRING(64), // sha256 hex digest
      allowNull: false,
      unique: true,
    },
    family_id: {
      type: DataTypes.STRING(36), // uuid of the rotation lineage
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
    underscored: true,
  }
);

export default RefreshToken;

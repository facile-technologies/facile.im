import { DataTypes } from "sequelize";
import { sequelize } from "../database/connectDB.js";

const TeamMember = sequelize.define(
  "TeamMember",
  {
     id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // 👈 allow null for invited users
    },


    


    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
     invitation_status: {
        type: DataTypes.ENUM('INVITED', 'ACCEPTED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'INVITED',
      },
   
     user_profile_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "team_members",
    timestamps: true,
    underscored: true,
  }
);

export default TeamMember;

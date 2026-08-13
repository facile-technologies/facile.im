// database/connectDB.js
import { Sequelize } from "sequelize";
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from "../config/index.js";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: "mysql",
  logging: false, // turn on for debugging if needed
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Successfully connected to MySQL");

    // Sync models (DEV only – in PROD use migrations)
    // await sequelize.sync(); // or { alter: true } while iterating on schema

    console.log("✅ Models synchronized");
  } catch (err) {
    console.error("❌ MySQL Connection Error:", err);
    process.exit(1);
  }
};

export default connectDB;

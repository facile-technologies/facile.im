import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import { sequelize } from "../database/connectDB.js";

const ADMIN_EMAIL = "admin@facile.com";
const ADMIN_PASSWORD = "Admin@123"; 
async function createAdmin() {
  try {
    // ensure DB connection
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // create admin user
    await User.create({
      full_name: "System Admin",
      first_name: "System",
      last_name: "Admin",
      username: "admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
      profile_type: "PERSONAL",
      provider: "LOCAL",
      is_verified: true,
    });

    console.log("🎉 Admin user created successfully");
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdmin();

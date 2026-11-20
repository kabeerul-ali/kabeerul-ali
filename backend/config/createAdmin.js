
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await Admin.create({
    email,
    password: hashedPassword,
  });

  console.log("Initial admin created successfully");
};

export default createAdmin;


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import asyncHandler from "../utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    admin: {
      id: admin._id,
      email: admin.email,
    },
  });
});

export const getAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      email: req.admin.email,
    },
  });
});

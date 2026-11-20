
import Profile from "../models/Profile.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();

  res.status(200).json({
    success: true,
    profile,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "designation",
    "tagline",
    "bio",
    "profileImage",
    "email",
    "phone",
    "location",
    "resumeUrl",
    "socialLinks",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.name !== undefined && !updates.name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Profile name cannot be empty",
    });
  }

  if (updates.socialLinks !== undefined) {
    if (
      !updates.socialLinks ||
      typeof updates.socialLinks !== "object" ||
      Array.isArray(updates.socialLinks)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid social links",
      });
    }
  }

  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: updates },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile,
  });
});


import Skill from "../models/Skill.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({
    order: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
});

export const getAllSkills = getSkills;

export const createSkill = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  if (!name?.trim() || !category) {
    return res.status(400).json({
      success: false,
      message: "Skill name and category are required",
    });
  }

  const skill = await Skill.create({
    ...req.body,
    name: name.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Skill created successfully",
    skill,
  });
});

export const updateSkill = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  delete updates._id;
  delete updates.__v;

  const skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!skill) {
    return res.status(404).json({
      success: false,
      message: "Skill not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return res.status(404).json({
      success: false,
      message: "Skill not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});

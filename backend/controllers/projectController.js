
import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ status: "published" })
    .sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({
    order: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({ success: true, project });
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const slug = makeSlug(title);

  if (!slug) {
    return res.status(400).json({
      success: false,
      message: "Invalid project title",
    });
  }

  const project = await Project.create({
    ...req.body,
    title: title.trim(),
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  delete updates._id;
  delete updates.__v;

  if (updates.title !== undefined) {
    if (!updates.title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title cannot be empty",
      });
    }

    updates.slug = makeSlug(updates.title);
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

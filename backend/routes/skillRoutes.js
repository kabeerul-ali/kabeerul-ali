
import express from "express";
import {
  getSkills,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getSkills);

// Admin protected
router.get("/admin/all", authMiddleware, getAllSkills);
router.post("/", authMiddleware, createSkill);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);

export default router;

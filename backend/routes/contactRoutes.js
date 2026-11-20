
import express from "express";
import rateLimit from "express-rate-limit";

import {
  sendContactMessage,
  getAllConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/contactController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rate limiter for public contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages. Please try again later.",
  },
});

// Public route
router.post("/send", contactLimiter, sendContactMessage);

// Admin routes
router.get("/admin/all", authMiddleware, getAllConversations);
router.get("/:id", authMiddleware, getConversationById);
router.delete("/:id", authMiddleware, deleteConversation);

export default router;


import Contact from "../models/Contact.js";
import { saveContactMessage } from "../services/contactService.js";
import asyncHandler from "../utils/asyncHandler.js";

// Public: Save contact message
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !message?.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validEmail.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length < 7 || digits.length > 15) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid phone number",
    });
  }

  if (name.trim().length > 100 || message.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Name or message is too long",
    });
  }

  await saveContactMessage({
    name,
    email,
    phone,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully",
  });
});

// Admin: Get all conversations
export const getAllConversations = asyncHandler(async (req, res) => {
  const conversations = await Contact.find()
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: conversations.length,
    conversations,
  });
});

// Admin: Get one conversation
export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Contact.findById(req.params.id);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  res.status(200).json({
    success: true,
    conversation,
  });
});

// Admin: Delete complete conversation
export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Contact.findByIdAndDelete(req.params.id);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Conversation deleted successfully",
  });
});

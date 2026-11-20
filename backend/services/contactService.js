
import Contact from "../models/Contact.js";

export const saveContactMessage = async ({
  name,
  email,
  phone,
  message,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    return await Contact.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $setOnInsert: { email: normalizedEmail },
        $push: {
          messages: {
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim(),
            createdAt: new Date(),
          },
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
  } catch (error) {
    // Handles simultaneous first submissions for the same email.
    if (error.code !== 11000) throw error;

    return Contact.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $push: {
          messages: {
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim(),
            createdAt: new Date(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
};

// controllers/bookingController.js
import {
  bookCourseForUser,
  bookSessionForUser,
  cancelBookingForUser,
} from "../services/bookingService.js";

export const bookCourse = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ error: "userId is required." });
    }
    if (!courseId || typeof courseId !== "string" || courseId.trim() === "") {
      return res.status(400).json({ error: "courseId is required." });
    }

    const booking = await bookCourseForUser(userId, courseId);
    res.status(201).json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const bookSession = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ error: "userId is required." });
    }
    if (!sessionId || typeof sessionId !== "string" || sessionId.trim() === "") {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const booking = await bookSessionForUser(userId, sessionId);
    res.status(201).json({ booking });
  } catch (err) {
    res
      .status(err.code === "DROPIN_NOT_ALLOWED" ? 400 : 500)
      .json({ error: err.message });
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Booking ID is required." });
    }

    const booking = await cancelBookingForUser(id);
    res.status(200).json({ booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// controllers/bookingController.js
import {
  bookCourseForUser,
  bookSessionForUser,
} from "../services/bookingService.js";
import { BookingModel } from "../models/bookingModel.js";
import { SessionModel } from "../models/sessionModel.js";

export const bookCourse = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;

    // Validate IDs are present before hitting the database
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ error: "userId is required." });
    }
    if (!courseId || typeof courseId !== "string" || courseId.trim() === "") {
      return res.status(400).json({ error: "courseId is required." });
    }

    const booking = await bookCourseForUser(userId, courseId);
    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const bookSession = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.body;

    // Validate IDs are present before hitting the database
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ error: "userId is required." });
    }
    if (!sessionId || typeof sessionId !== "string" || sessionId.trim() === "") {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const booking = await bookSessionForUser(userId, sessionId);
    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res
      .status(err.code === "DROPIN_NOT_ALLOWED" ? 400 : 500)
      .json({ error: err.message });
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Validate bookingId is present
    if (!bookingId || typeof bookingId !== "string" || bookingId.trim() === "") {
      return res.status(400).json({ error: "bookingId is required." });
    }

    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "CANCELLED") return res.json({ booking });

    if (booking.status === "CONFIRMED") {
      for (const sid of booking.sessionIds) {
        await SessionModel.incrementBookedCount(sid, -1);
      }
    }
    const updated = await BookingModel.cancel(bookingId);
    res.json({ booking: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};
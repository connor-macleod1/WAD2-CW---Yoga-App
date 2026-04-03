// controllers/viewsController.js
import {
  getHomePageData,
  getCourseDetailData,
} from "../services/viewsService.js";
import {
  bookCourseForUser,
  bookSessionForUser,
} from "../services/bookingService.js";
import { BookingModel } from "../models/bookingModel.js";

const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const homePage = async (req, res, next) => {
  try {
    const courses = await getHomePageData();
    res.render("home", { title: "Yoga Courses", courses });
  } catch (err) {
    next(err);
  }
};

export const courseDetailPage = async (req, res, next) => {
  try {
    const { course, sessions } = await getCourseDetailData(req.params.id);
    res.render("course", {
      title: course.title,
      course,
      sessions,
    });
  } catch (err) {
    if (err.message === "Course not found") {
      return res.status(404).render("error", {
        title: "Not found",
        message: "Course not found",
      });
    }
    next(err);
  }
};

export const postBookCourse = async (req, res, next) => {
  try {
    if (req.user.role === "organiser") {
      return res.status(403).render("error", {
        title: "Forbidden",
        message: "Organisers cannot book courses.",
      });
    }
    const courseId = req.params.id;
    const booking = await bookCourseForUser(req.user._id, courseId);
    res.redirect(`/bookings/${booking._id}?status=${booking.status}`);
  } catch (err) {
    res.status(400).render("error", {
      title: "Booking failed",
      message: err.message,
    });
  }
};

export const postBookSession = async (req, res, next) => {
  try {
    if (req.user.role === "organiser") {
      return res.status(403).render("error", {
        title: "Forbidden",
        message: "Organisers cannot book sessions.",
      });
    }
    const sessionId = req.params.id;
    const booking = await bookSessionForUser(req.user._id, sessionId);
    res.redirect(`/bookings/${booking._id}?status=${booking.status}`);
  } catch (err) {
    const message =
      err.code === "DROPIN_NOT_ALLOWED"
        ? "Drop-ins are not allowed for this course."
        : err.message;
    res.status(400).render("error", { title: "Booking failed", message });
  }
};

export const bookingConfirmationPage = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await BookingModel.findById(bookingId);
    if (!booking)
      return res.status(404).render("error", {
        title: "Not found",
        message: "Booking not found",
      });

    const allowedStatuses = ["CONFIRMED", "WAITLISTED", "CANCELLED"];
    const status = allowedStatuses.includes(req.query.status)
      ? req.query.status
      : booking.status;

    res.render("booking_confirmation", {
      title: "Booking confirmation",
      booking: {
        id: booking._id,
        type: booking.type,
        status,
        createdAt: booking.createdAt ? fmtDate(booking.createdAt) : "",
      },
    });
  } catch (err) {
    next(err);
  }
};

export const showRegistrationPage = (req, res) => {
  res.render("register", { title: "User Registration" });
};

export const showLoginPage = (req, res) => {
  res.render("login", { title: "Sign In" });
};
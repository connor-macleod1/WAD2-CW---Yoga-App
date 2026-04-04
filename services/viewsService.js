// services/viewsService.js
import { CourseModel } from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";
import { calcDuration, fmtDate, fmtDateOnly } from "../utils/dateUtils.js";
import { BookingModel } from "../models/bookingModel.js";


export async function getHomePageData() {
  const courses = await CourseModel.list();
  const cards = await Promise.all(
    courses.map(async (c) => {
      const sessions = await SessionModel.listByCourse(c._id);
      const nextSession = sessions[0];
      return {
        id: c._id,
        title: c.title,
        level: c.level,
        type: c.type,
        allowDropIn: c.allowDropIn,
        startDate: c.startDate ? fmtDateOnly(c.startDate) : "",
        endDate: c.endDate ? fmtDateOnly(c.endDate) : "",
        nextSession: nextSession ? fmtDate(nextSession.startDateTime) : "TBA",
        sessionsCount: sessions.length,
        description: c.description,
      };
    })
  );
  return cards;
}

export async function getCourseDetailData(courseId) {
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error("Course not found");

  const sessions = await SessionModel.listByCourse(courseId);
  const rows = sessions.map((s) => ({
    id: s._id,
    start: fmtDate(s.startDateTime),
    end: fmtDate(s.endDateTime),
    duration: calcDuration(s.startDateTime, s.endDateTime),
    capacity: s.capacity,
    booked: s.bookedCount ?? 0,
    remaining: Math.max(0, (s.capacity ?? 0) - (s.bookedCount ?? 0)),
    location: s.location ?? "TBA",
    price: s.price ?? 0,
  }));

  return {
    course: {
      id: course._id,
      title: course.title,
      level: course.level,
      type: course.type,
      allowDropIn: course.allowDropIn,
      startDate: course.startDate ? fmtDateOnly(course.startDate) : "",
      endDate: course.endDate ? fmtDateOnly(course.endDate) : "",
      description: course.description,
    },
    sessions: rows,
  };
}

export async function getSessionDetail(sessionId, userId) {
  const session = await SessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const course = await CourseModel.findById(session.courseId);
  if (!course) throw new Error("Course not found");

  // Check if user has already booked
  let alreadyBooked = false;
  if (userId) {
    const existing = await BookingModel.findByUserAndSession(userId, sessionId);
    alreadyBooked = !!existing;
  }

  return {
    session: {
      id: session._id,
      start: fmtDate(session.startDateTime),
      end: fmtDate(session.endDateTime),
      duration: calcDuration(session.startDateTime, session.endDateTime),
      location: session.location ?? "TBA",
      price: session.price ?? 0,
      capacity: session.capacity,
      booked: session.bookedCount ?? 0,
      remaining: Math.max(0, (session.capacity ?? 0) - (session.bookedCount ?? 0)),
      allowDropIn: course.allowDropIn,
    },
    course: {
      id: course._id,
      title: course.title,
      allowDropIn: course.allowDropIn,
    },
    alreadyBooked,
  };
}
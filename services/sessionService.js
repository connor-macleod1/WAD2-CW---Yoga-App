// services/sessionService.js
import { SessionModel } from "../models/sessionModel.js";
import { CourseModel } from "../models/courseModel.js";

export async function createSession(body) {
  const { courseId, startDateTime, endDateTime, capacity } = body;

  // Validate required fields
  if (!courseId || typeof courseId !== "string" || courseId.trim() === "") {
    throw new Error("Course ID is required.");
  }
  if (!startDateTime) {
    throw new Error("Start date and time is required.");
  }
  if (!endDateTime) {
    throw new Error("End date and time is required.");
  }
  if (!capacity || isNaN(capacity) || Number(capacity) <= 0) {
    throw new Error("Capacity must be a positive number.");
  }

  // Validate that the referenced course actually exists
  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new Error("Course not found.");
  }

  // Validate that start is before end
  if (new Date(startDateTime) >= new Date(endDateTime)) {
    throw new Error("Start date and time must be before end date and time.");
  }

  // Build a clean known-shape object
  const sessionData = {
    courseId: courseId.trim(),
    startDateTime,
    endDateTime,
    capacity: Number(capacity),
    bookedCount: 0,
  };

  return SessionModel.create(sessionData);
}

export async function deleteSession(id) {
  if (!id) throw new Error("Session ID is required.");

  const session = await SessionModel.findById(id);
  if (!session) throw new Error("Session not found.");

  return SessionModel.delete(id);
}

export async function getSessionById(id) {
  if (!id) throw new Error("Session ID is required.");

  const session = await SessionModel.findById(id);
  if (!session) throw new Error("Session not found.");

  return session;
}

export async function updateSession(id, body) {
  if (!id) throw new Error("Session ID is required.");

  const session = await SessionModel.findById(id);
  if (!session) throw new Error("Session not found.");

  // Optional: validate or sanitize fields from body
  const updatedData = {
    startDateTime: body.startDateTime ?? session.startDateTime,
    endDateTime: body.endDateTime ?? session.endDateTime,
    capacity: body.capacity != null ? Number(body.capacity) : session.capacity,
    // add other session fields if necessary
  };

  // Validate that start < end
  if (new Date(updatedData.startDateTime) >= new Date(updatedData.endDateTime)) {
    throw new Error("Start date and time must be before end date and time.");
  }
    return SessionModel.update(id, updatedData);
}
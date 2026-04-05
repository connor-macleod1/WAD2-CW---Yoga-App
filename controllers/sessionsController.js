// controllers/sessionsController.js
import {
  createSession,
  listSessionsByCourse,
} from "../services/sessionService.js";

export const createSessionHandler = async (req, res, next) => {
  try {
    const session = await createSession(req.body);
    res.status(201).json({ session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listCourseSessions = async (req, res, next) => {
  try {
    const sessions = await listSessionsByCourse(req.params.courseId);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};
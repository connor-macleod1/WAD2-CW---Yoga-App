// controllers/sessionsController.js
import { SessionModel } from "../models/sessionModel.js";

export const createSession = async (req, res) => {
  const session = await SessionModel.create({ ...req.body, bookedCount: 0 });
  res.status(201).json({ session });
};

export const listCourseSessions =  async (req, res) => {
  const sessions = await SessionModel.listByCourse(req.params.courseId);
  res.json({ sessions });
};





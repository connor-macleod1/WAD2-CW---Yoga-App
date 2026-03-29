// routes/sessions.js
import { Router } from 'express';
import { SessionModel } from '../models/sessionModel.js';
import { createSession, listCourseSessions } from '../controllers/sessionsController.js';
const router = Router();

router.post('/', createSession);
router.get('/by-course/:courseId', listCourseSessions);


export default router;

// routes/sessions.js
import { Router } from 'express';
import { createSessionHandler, listCourseSessions } from "../controllers/sessionsController.js";

const router = Router();

router.post('/', createSessionHandler);
router.get('/by-course/:courseId', listCourseSessions);


export default router;

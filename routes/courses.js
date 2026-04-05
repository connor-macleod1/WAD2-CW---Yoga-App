// routes/courses.js
import { Router } from "express";
import { listCoursesHandler, getCourseSessions, createCourseHandler } from "../controllers/coursesController.js";
const router = Router();

router.get("/", listCoursesHandler);
router.post("/", createCourseHandler);
router.get("/:id", getCourseSessions);


export default router;

// routes/courses.js
import { Router } from "express";
import { listCourses, getCourseSessions, createCourseHandler } from "../controllers/coursesController.js";
const router = Router();

router.get("/", listCourses);
router.post("/", createCourseHandler);
router.get("/:id", getCourseSessions);


export default router;

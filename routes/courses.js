// routes/courses.js
import { Router } from "express";
import { listCourses, createCourse, getCourseSessions } from "../controllers/coursesController.js";
const router = Router();

router.get("/", listCourses);
router.post("/", createCourse);
router.get("/:id", getCourseSessions);


export default router;

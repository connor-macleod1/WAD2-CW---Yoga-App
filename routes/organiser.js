// routes/organiser.js
import { Router } from "express";
import { requireOrganiser } from "../middlewares/requireOrganiser.js";
import {
  organiserDashboard,
  getNewCoursePage,
  postNewCourse,
  getEditCoursePage,
  postEditCourse,
  deleteCourseHandler,
  getNewSessionPage,
  postNewSession,
  getEditSessionPage,
  postEditSession,
  deleteSessionHandler,
  organiserCourseDetail, 
  getParticipantList,
  getUserManagementPage,
  deleteUserHandler,
  promoteUserHandler,
  demoteUserHandler,
} from "../controllers/organiserController.js";

const router = Router();

// Apply requireOrganiser to all organiser routes
router.use(requireOrganiser);

// Dashboard
router.get("/", organiserDashboard);

// COURSES - MORE SPECIFIC ROUTES FIRST
router.get("/courses/new", getNewCoursePage);        // ← Must come BEFORE /:id routes
router.post("/courses/new", postNewCourse);
router.get("/courses/:id/edit", getEditCoursePage);
router.post("/courses/:id/edit", postEditCourse);
router.post("/courses/:id/delete", deleteCourseHandler);
router.get("/courses/:id", organiserCourseDetail);   // ← Generic :id route LAST

// SESSIONS
router.get("/courses/:courseId/sessions/new", getNewSessionPage);
router.post("/courses/:courseId/sessions/new", postNewSession);
router.get("/sessions/:id/edit", getEditSessionPage);
router.post("/sessions/:id/edit", postEditSession);
router.post("/sessions/:id/delete", deleteSessionHandler);
router.get("/sessions/:id/participants", getParticipantList);

// USERS
router.get("/users", getUserManagementPage);
router.post("/users/:id/delete", deleteUserHandler);
router.post("/users/:id/promote", promoteUserHandler);
router.post("/users/:id/demote", demoteUserHandler);

export default router;
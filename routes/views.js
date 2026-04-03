// routes/views.js
import { Router } from "express";
import {
  homePage,
  courseDetailPage,
  postBookCourse,
  postBookSession,
  bookingConfirmationPage,
  showRegistrationPage,
  showLoginPage,
} from "../controllers/viewsController.js";

import { coursesListPage } from "../controllers/coursesController.js";
import { requireAuth } from "../middlewares/requireAuth.js";


const router = Router();

router.get("/", homePage);
router.get("/courses", coursesListPage);
router.get("/courses/:id", courseDetailPage);
router.post("/courses/:id/book", requireAuth, postBookCourse);
router.post("/sessions/:id/book", requireAuth, postBookSession);
router.get("/bookings/:bookingId", bookingConfirmationPage);
router.get("/register", showRegistrationPage);
router.get("/login", showLoginPage);
export default router;

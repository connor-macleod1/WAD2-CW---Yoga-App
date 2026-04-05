// controllers/organiserController.js
import { createCourse, listCourses, getCourseById, updateCourse, deleteCourse } from "../services/courseService.js";
import { createSession, getSessionById, updateSession, deleteSession, listSessionsByCourse, getSessionParticipants } from "../services/sessionService.js";
import {
  listUsers,
  deleteUser,
  promoteToOrganiser,
  demoteFromOrganiser,
} from "../services/userService.js";
import { calcDuration } from "../utils/dateUtils.js";

// Dashboard
export const organiserDashboard = async (req, res, next) => {
  try {
    const courses = await listCourses();
    res.render("organiser/dashboard", {
      title: "Organiser Dashboard",
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// COURSES
export const getNewCoursePage = (req, res) => {
  res.render("organiser/course_form", {
    title: "Add New Course",
    action: "/organiser/courses/new",
    course: {},
  });
};

export const postNewCourse = async (req, res, next) => {
  try {
    console.log("=== POST NEW COURSE ===");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    
    if (!req.user) {
      console.error("ERROR: req.user is null!");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const courseData = {
      ...req.body,
      instructorId: req.user._id,
    };
    
    console.log("Creating course with data:", courseData);
    const result = await createCourse(courseData);
    console.log("✓ Course created successfully:", result);
    res.redirect("/organiser");
  } catch (err) {
    console.error("✗ ERROR in postNewCourse:", err.message);
    console.error("Stack:", err.stack);
    res.status(400).render("organiser/course_form", {
      title: "Add New Course",
      action: "/organiser/courses/new",
      course: req.body,
      errors: { message: err.message },
    });
  }
};

export const getEditCoursePage = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course)
      return res.status(404).render("error", { title: "Not found", message: "Course not found" });

    res.render("organiser/course_form", {
      title: "Edit Course",
      action: `/organiser/courses/${course._id}/edit`,
      course,
    });
  } catch (err) {
    next(err);
  }
};

export const postEditCourse = async (req, res, next) => {
  try {
    await updateCourse(req.params.id, req.body);
    res.redirect("/organiser");
  } catch (err) {
    res.status(400).render("organiser/course_form", {
      title: "Edit Course",
      action: `/organiser/courses/${req.params.id}/edit`,
      course: req.body,
      errors: { message: err.message },
    });
  }
};

export const deleteCourseHandler = async (req, res, next) => {
  try {
    await deleteCourse(req.params.id);
    res.redirect("/organiser");
  } catch (err) {
    next(err);
  }
};

// SESSIONS
export const getNewSessionPage = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.courseId);
    if (!course)
      return res.status(404).render("error", { title: "Not found", message: "Course not found" });

    res.render("organiser/session_form", {
      title: "Add New Session",
      action: `/organiser/courses/${course._id}/sessions/new`,
      course,
      session: {},
    });
  } catch (err) {
    next(err);
  }
};

export const postNewSession = async (req, res, next) => {
  try {
    await createSession({ ...req.body, courseId: req.params.courseId });
    res.redirect("/organiser");
  } catch (err) {
    res.status(400).render("organiser/session_form", {
      title: "Add New Session",
      action: `/organiser/courses/${req.params.courseId}/sessions/new`,
      session: req.body,
      errors: { message: err.message },
    });
  }
};

export const getEditSessionPage = async (req, res, next) => {
  try {
    const session = await getSessionById(req.params.id);
    if (!session)
      return res.status(404).render("error", { title: "Not found", message: "Session not found" });

    res.render("organiser/session_form", {
      title: "Edit Session",
      action: `/organiser/sessions/${session._id}/edit`,
      session,
    });
  } catch (err) {
    next(err);
  }
};

export const postEditSession = async (req, res, next) => {
  try {
    await updateSession(req.params.id, req.body);
    res.redirect("/organiser");
  } catch (err) {
    res.status(400).render("organiser/session_form", {
      title: "Edit Session",
      action: `/organiser/sessions/${req.params.id}/edit`,
      session: req.body,
      errors: { message: err.message },
    });
  }
};

export const deleteSessionHandler = async (req, res, next) => {
  try {
    await deleteSession(req.params.id);
    res.redirect("/organiser");
  } catch (err) {
    next(err);
  }
};

export const organiserCourseDetail = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    const sessions = await listSessionsByCourse(req.params.id);

    const sessionRows = sessions.map((s) => ({
      id: s._id,
      start: new Date(s.startDateTime).toLocaleString("en-GB"),
      end: new Date(s.endDateTime).toLocaleString("en-GB"),
      duration: calcDuration(s.startDateTime, s.endDateTime),
      capacity: s.capacity,
      booked: s.bookedCount ?? 0,
      remaining: Math.max(0, (s.capacity ?? 0) - (s.bookedCount ?? 0)),
      location: s.location ?? "TBA",
      price: s.price ?? 0,
    }));

    res.render("organiser/course_sessions", {
      title: course.title,
      course,
      sessions: sessionRows,
      hasSessions: sessionRows.length > 0,
    });
  } catch (err) {
    next(err);
  }
};

export const getParticipantList = async (req, res, next) => {
  try {
    const { session, participants, hasParticipants } = 
      await getSessionParticipants(req.params.id);

    res.render("organiser/participant_list", {
      title: "Class List",
      session,
      participants,
      hasParticipants,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserManagementPage = async (req, res, next) => {
  try {
    const users = await listUsers();
    const userRows = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      isOrganiser: u.role === "organiser",
      isStudent: u.role === "student",
    }));
    res.render("organiser/users", {
      title: "User Management",
      users: userRows,
      hasUsers: userRows.length > 0,
    });
  } catch (err) {
    next(err);
  }
};

export const promoteUserHandler = async (req, res, next) => {
  try {
    await promoteToOrganiser(req.params.id);
    res.redirect("/organiser/users");
  } catch (err) {
    next(err);
  }
};

export const deleteUserHandler = async (req, res, next) => {
  try {
    await deleteUser(req.params.id, req.user._id);
    res.redirect("/organiser/users");
  } catch (err) {
    res.status(400).render("organiser/users", {
      title: "User Management",
      errors: { message: err.message },
    });
  }
};

export const demoteUserHandler = async (req, res, next) => {
  try {
    await demoteFromOrganiser(req.params.id, req.user._id);
    res.redirect("/organiser/users");
  } catch (err) {
    res.status(400).render("organiser/users", {
      title: "User Management",
      errors: { message: err.message },
    });
  }
};
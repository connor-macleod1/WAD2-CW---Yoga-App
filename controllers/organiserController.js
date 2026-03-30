// controllers/organiserController.js
import { createCourse, listCourses, getCourseById, updateCourse, deleteCourse } from "../services/courseService.js";
import { createSession, getSessionById, updateSession, deleteSession } from "../services/sessionService.js";

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
    await createCourse(req.body);
    res.redirect("/organiser");
  } catch (err) {
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
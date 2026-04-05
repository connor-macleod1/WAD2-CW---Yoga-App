// controllers/coursesController.js
import {
  createCourse,
  searchCourses,
  getCourseById,
  listCourses,
  getCourseDetailData
} from "../services/courseService.js";

export const listCoursesHandler = async (req, res, next) => {
  try {
    const courses = await listCourses();
    res.json({ courses });
  } catch (err) {
    next(err);
  }
};

export const createCourseHandler = async (req, res, next) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json({ course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCourseSessions = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    // Get sessions through the service layer
    const { sessions } = await getCourseDetailData(req.params.id);
    res.json({ course, sessions });
  } catch (err) {
    if (err.message === "Course not found") {
      return res.status(404).json({ error: "Course not found" });
    }
    next(err);
  }
};

export const coursesListPage = async (req, res, next) => {
  try {
    const basePath = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;
    const { courses, pagination } = await searchCourses(req.query, basePath);
    res.render("courses", {
      title: "Courses",
      filters: req.query,
      courses,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};
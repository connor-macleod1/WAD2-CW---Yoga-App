// controllers/coursesController.js
import { CourseModel } from "../models/courseModel.js";
import { searchCourses } from "../services/courseService.js";
import { courseService } from "../services/courseService.js";

export const listCourses = async (req, res) => {
  const courses = await CourseModel.list();
  res.json({ courses });
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({ course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCourseSessions = async (req, res) => {
  const course = await CourseModel.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const sessions = await SessionModel.listByCourse(course._id);
  res.json({ course, sessions });
};

export const coursesListPage_old = async (req, res, next) => {
  try {
    const { courses, pagination } = await searchCourses(req.query, req);
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

// controller
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
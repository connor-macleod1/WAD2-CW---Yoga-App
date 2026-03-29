// controllers/coursesController.js
import { CourseModel } from "../models/courseModel.js";
import { searchCourses } from "../services/courseService.js";

export const listCourses = async (req, res) => {
  const courses = await CourseModel.list();
  res.json({ courses });
};

export const createCourse = async (req, res) => {
  const course = await CourseModel.create(req.body);
  res.status(201).json({ course });
};

export const getCourseSessions = async (req, res) => {
  const course = await CourseModel.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const sessions = await SessionModel.listByCourse(course._id);
  res.json({ course, sessions });
};

export const coursesListPage = async (req, res, next) => {
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
// services/courseService.js
import { CourseModel } from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";

const fmtDateOnly = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBA";

function buildLink(basePath, query, page, pageSize) {
  const params = new URLSearchParams(query);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return `${basePath}?${params.toString()}`;
}

export async function searchCourses(filters, basePath) {
  const { level, type, dropin, q, page = "1", pageSize = "10" } = filters;

  // Build database predicate
  const filter = {};
  if (level) filter.level = level;
  if (type) filter.type = type;
  if (dropin === "yes") filter.allowDropIn = true;
  if (dropin === "no") filter.allowDropIn = false;

  // Fetch matching courses
  let courses = await CourseModel.list(filter);

  // In-memory text search
  const needle = (q || "").trim().toLowerCase();
  if (needle) {
    courses = courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(needle) ||
        c.description?.toLowerCase().includes(needle)
    );
  }

  // Sort by startDate ascending, courses without dates sort last
  courses.sort((a, b) => {
    const ad = a.startDate
      ? new Date(a.startDate).getTime()
      : Number.MAX_SAFE_INTEGER;
    const bd = b.startDate
      ? new Date(b.startDate).getTime()
      : Number.MAX_SAFE_INTEGER;
    if (ad !== bd) return ad - bd;
    return (a.title || "").localeCompare(b.title || "");
  });

  // Pagination
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, parseInt(pageSize, 10) || 10);
  const total = courses.length;
  const totalPages = Math.max(1, Math.ceil(total / ps));
  const start = (p - 1) * ps;
  const pageItems = courses.slice(start, start + ps);

  // Build view model cards
  const cards = await Promise.all(
    pageItems.map(async (c) => {
      const sessions = await SessionModel.listByCourse(c._id);
      const first = sessions[0];
      return {
        id: c._id,
        title: c.title,
        level: c.level,
        type: c.type,
        allowDropIn: c.allowDropIn,
        startDate: fmtDateOnly(c.startDate),
        endDate: fmtDateOnly(c.endDate),
        nextSession: first ? fmtDateTime(first.startDateTime) : "TBA",
        sessionsCount: sessions.length,
        description: c.description,
      };
    })
  );

  const pagination = {
    page: p,
    pageSize: ps,
    total,
    totalPages,
    hasPrev: p > 1,
    hasNext: p < totalPages,
    prevLink: p > 1 ? buildLink(basePath, p - 1, ps) : null,
    nextLink: p < totalPages ? buildLink(basePath, p + 1, ps) : null,
  };

  return { courses: cards, pagination };
}

export async function createCourse(body) {
  const { title, level, type, allowDropIn, startDate, endDate, description, instructorId } = body;

  // Validate required fields
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new Error("Course title is required.");
  }
  if (!["beginner", "intermediate", "advanced"].includes(level)) {
    throw new Error("Level must be beginner, intermediate, or advanced.");
  }
  if (!["WEEKLY_BLOCK", "WEEKEND_WORKSHOP"].includes(type)) {
    throw new Error("Type must be WEEKLY_BLOCK or WEEKEND_WORKSHOP.");
  }

  // Build a clean known-shape object
  const courseData = {
    title: title.trim(),
    level,
    type,
    allowDropIn: allowDropIn === true || allowDropIn === "true",
    startDate: startDate || null,
    endDate: endDate || null,
    description: description?.trim() || "",
    instructorId: instructorId || null,
    sessionIds: [],
  };

  try {
  return await CourseModel.create(courseData);
} catch (err) {
  throw new Error(`Failed to create course: ${err.message}`);
}
}


export async function deleteCourse(id) {
  if (!id) throw new Error("Course ID is required.");

  const course = await CourseModel.findById(id);
  if (!course) throw new Error("Course not found.");

  return CourseModel.delete(id);
}

export async function getCourseById(id) {
  if (!id) throw new Error("Course ID is required.");

  const course = await CourseModel.findById(id);
  if (!course) throw new Error("Course not found.");

  return course;
}

export async function listCourses() {
  return CourseModel.list();
}

export async function updateCourse(id, body) {
  if (!id) throw new Error("Course ID is required.");

  const course = await CourseModel.findById(id);
  if (!course) throw new Error("Course not found.");

  // Optionally, validate fields here if needed
  const updatedData = {
    name: body.name ?? course.name,
    description: body.description ?? course.description,
    duration: body.duration ?? course.duration,
    // add other course fields as necessary
  };

  return CourseModel.update(id, updatedData);
}
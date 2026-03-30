// middlewares/requireOrganiser.js
export const requireOrganiser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).render("error", {
      title: "Unauthorised",
      message: "You must be logged in to access this page.",
    });
  }
  if (req.user.role !== "organiser") {
    return res.status(403).render("error", {
      title: "Forbidden",
      message: "You do not have permission to access this page.",
    });
  }
  next();
};

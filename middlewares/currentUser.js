// middlewares/currentUser.js
import { UserModel } from "../models/userModel.js";

export const attachCurrentUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      console.log("Session userId found:", req.session.userId);
      const user = await UserModel.findById(req.session.userId);
      console.log("User found:", user);
      req.user = user || null;
      res.locals.user = user || null;
    } else {
      console.log("No session userId found");
      req.user = null;
      res.locals.user = null;
    }
    next();
  } catch (err) {
    next(err);
  }
};
// middlewares/currentUser.js
import { UserModel } from "../models/userModel.js";

export const attachCurrentUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await UserModel.findById(req.session.userId);
      req.user = user || null;

      if (user) {
       
        const plainUser = typeof user.toObject === "function" ? user.toObject() : user;
        res.locals.user = { ...plainUser, isOrganiser: plainUser.role === "organiser" };
      } else {
        res.locals.user = null;
      }
    } else {
      req.user = null;
      res.locals.user = null;
    }
    next();
  } catch (err) {
    next(err);
  }
};
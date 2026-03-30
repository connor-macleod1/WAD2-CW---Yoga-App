// controllers/userController.js
import { registerUser, loginUser } from "../services/userService.js";

export const post_new_user = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    await registerUser(name, email, role, password);
    console.log(`Registered user: ${name}`);
    res.redirect("/login");
  } catch (err) {
    res.status(400).render("register", {
      title: "Register",
      errors: { message: err.message },
    });
  }
};

export const post_login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    res.status(401).render("login", {
      title: "Sign In",
      errors: { message: err.message },
    });
  }
};

export const logoutUser = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
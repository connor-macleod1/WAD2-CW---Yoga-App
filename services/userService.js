// services/userService.js
import { UserModel } from "../models/userModel.js";

export async function registerUser(name, email, role, password) {
  // Validate required fields
  if (!name || !email || !role || !password) {
    throw new Error("All fields are required.");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (!["student", "instructor"].includes(role)) {
    throw new Error("Role must be student or instructor.");
  }

  // Check for existing user
  const existing = await UserModel.findByEmail(email);
  if (existing) {
    throw new Error("An account with that email already exists.");
  }

  return UserModel.create(name, email, role, password);
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new Error("No account found with that email.");
  }

  const valid = await UserModel.verifyPassword(password, user.password);
  if (!valid) {
    throw new Error("Incorrect password.");
  }

  return user;
}
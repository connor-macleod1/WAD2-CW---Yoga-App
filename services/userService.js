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
  if (!["user", "organiser"].includes(role)) {
    throw new Error("Role must be user or organiser.");
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

export async function listUsers() {
  return UserModel.list();
}

export async function deleteUser(id, requestingUserId) {
  if (!id) throw new Error("User ID is required.");
  if (id === requestingUserId) throw new Error("You cannot delete your own account.");
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found.");
  return UserModel.delete(id);
}

export async function promoteToOrganiser(id) {
  if (!id) throw new Error("User ID is required.");
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found.");
  if (user.role === "organiser") throw new Error("User is already an organiser.");
  return UserModel.updateRole(id, "organiser");
}

export async function demoteFromOrganiser(id, requestingUserId) {
  if (!id) throw new Error("User ID is required.");
  if (id === requestingUserId) throw new Error("You cannot remove your own organiser role.");
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found.");
  if (user.role !== "organiser") throw new Error("User is not an organiser.");
  return UserModel.updateRole(id, "user");
}
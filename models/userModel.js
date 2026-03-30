// models/userModel.js
import { usersDb } from './_db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const UserModel = {
  async create(name, email, role, password) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const entry = {
      name,
      email,
      role,
      password: hash,
    };
    return usersDb.insert(entry);
  },

  async findByEmail(email) {
    return usersDb.findOne({ email });
  },

  async findById(id) {
    return usersDb.findOne({ _id: id });
  },

  async findByName(name) {
    return usersDb.find({ name });
  },

  async verifyPassword(plainText, hashedPassword) {
    return bcrypt.compare(plainText, hashedPassword);
  }
};
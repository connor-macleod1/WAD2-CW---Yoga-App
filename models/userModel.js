
// models/userModel.js
import { usersDb } from './_db.js';
// import Datastore from "nedb-promises";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const UserModel = {
  async create(user, email, password) {
    const hash = await bcrypt.hash(password, saltRounds);

    const entry = {
      user: user,
      email: email,
      password: hash,
    };
    console.log("creating user ${user} with hashed password");
    try{
      const doc = await this.usersDb.insert(entry);
      return doc;
    } catch (err) {
      console.error("Error creating user ${user}:", err);
      throw err;
    }
    
  },

async findByUser(user) {
    try {
      const entries = await this.db.find({ user: user });
      return entries; // returns an array
    } catch (err) {
      console.error("Error looking up user:", err);
      throw err;
    }
  },


  async findByEmail(email) {
    return usersDb.findOne({ email });
  },
  async findById(id) {
    return usersDb.findOne({ _id: id });
  }
};

export default UserModel;

// models/_db.js
import Datastore from "nedb-promises";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always resolve relative to this file so seeding and server hit the SAME files
const dbDir = path.join(__dirname, "../db");

const inMemory = process.env.NODE_ENV === "test";

export const usersDb = Datastore.create({
  filename: inMemory ? undefined : path.join(dbDir, "users.db"),
  autoload: true,
  inMemoryOnly: inMemory,
});

export const coursesDb = Datastore.create({
  filename: inMemory ? undefined : path.join(dbDir, "courses.db"),
  autoload: true,
  inMemoryOnly: inMemory,
});

export const sessionsDb = Datastore.create({
  filename: inMemory ? undefined : path.join(dbDir, "sessions.db"),
  autoload: true,
  inMemoryOnly: inMemory,
});

export const bookingsDb = Datastore.create({
  filename: inMemory ? undefined : path.join(dbDir, "bookings.db"),
  autoload: true,
  inMemoryOnly: inMemory,
});

// Call this once at startup (server + seed)
export async function initDb() {
  if (!inMemory) {
    await fs.mkdir(dbDir, { recursive: true });
  }
  // Ensure helpful indexes are ready before we insert
  await usersDb.ensureIndex({ fieldName: "email", unique: true });
  await sessionsDb.ensureIndex({ fieldName: "courseId" });
}
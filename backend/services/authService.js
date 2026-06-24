const bcrypt = require("bcryptjs");
const db     = require("../config/db");

const SALT = 12;

async function findByEmail(email) {
  const [rows] = await db.query(
    "SELECT id,name,email,password_hash,title,location,website,bio FROM users WHERE email=? LIMIT 1",
    [email.toLowerCase().trim()]
  );
  return rows[0] ?? null;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id,name,email,title,location,website,bio,created_at FROM users WHERE id=? LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
}

async function createUser({ name, email, password }) {
  // Check duplicate email
  const [existing] = await db.query(
    "SELECT id FROM users WHERE email=? LIMIT 1",
    [email.toLowerCase().trim()]
  );
  if (existing.length > 0) {
    const err = new Error("Email already in use.");
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, SALT);
  const [result] = await db.query(
    "INSERT INTO users (name,email,password_hash,created_at) VALUES (?,?,?,NOW())",
    [name.trim(), email.toLowerCase().trim(), hash]
  );
  return { id:result.insertId, name:name.trim(), email:email.toLowerCase().trim() };
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

async function updateProfile(userId, fields) {
  const ok  = ["name","title","location","website","bio"];
  const set = [];
  const val = [];
  for (const k of ok) {
    if (Object.prototype.hasOwnProperty.call(fields, k)) { set.push(`${k}=?`); val.push(fields[k]); }
  }
  if (!set.length) return findById(userId);
  val.push(userId);
  await db.query(`UPDATE users SET ${set.join(",")},updated_at=NOW() WHERE id=?`, val);
  return findById(userId);
}

async function updatePassword(userId, newPass) {
  const hash = await bcrypt.hash(newPass, SALT);
  await db.query("UPDATE users SET password_hash=?,updated_at=NOW() WHERE id=?", [hash, userId]);
}

module.exports = { findByEmail, findById, createUser, verifyPassword, updateProfile, updatePassword };

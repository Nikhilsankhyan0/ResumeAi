const db = require("../config/db");

const User = {
  async create({ name, email, passwordHash }) {
    const [r] = await db.query(
      "INSERT INTO users (name,email,password_hash,created_at) VALUES (?,?,?,NOW())",
      [name.trim(), email.toLowerCase().trim(), passwordHash]
    );
    return { id:r.insertId, name:name.trim(), email:email.toLowerCase().trim() };
  },
  async findById(id) {
    const [rows] = await db.query(
      "SELECT id,name,email,title,location,website,bio,created_at FROM users WHERE id=? LIMIT 1", [id]
    );
    return rows[0] ?? null;
  },
  async findByEmail(email) {
    const [rows] = await db.query(
      "SELECT id,name,email,password_hash,title,location,website,bio FROM users WHERE email=? LIMIT 1",
      [email.toLowerCase().trim()]
    );
    return rows[0] ?? null;
  },
  async emailExists(email) {
    const [rows] = await db.query("SELECT id FROM users WHERE email=? LIMIT 1", [email.toLowerCase().trim()]);
    return rows.length > 0;
  },
  async update(id, fields) {
    const ok  = ["name","title","location","website","bio"];
    const set = [];
    const val = [];
    for (const k of ok) {
      if (Object.prototype.hasOwnProperty.call(fields, k)) { set.push(`${k}=?`); val.push(fields[k]); }
    }
    if (!set.length) return User.findById(id);
    val.push(id);
    await db.query(`UPDATE users SET ${set.join(",")},updated_at=NOW() WHERE id=?`, val);
    return User.findById(id);
  },
  async updatePassword(id, hash) {
    await db.query("UPDATE users SET password_hash=?,updated_at=NOW() WHERE id=?", [hash,id]);
  },
  async delete(id) {
    const [r] = await db.query("DELETE FROM users WHERE id=?", [id]);
    return r.affectedRows > 0;
  },
};

module.exports = User;

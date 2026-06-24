require("dotenv").config();
const http = require("http");
const fs   = require("fs");
const path = require("path");
const app  = require("./app");
const db   = require("./config/db");

const PORT = parseInt(process.env.PORT, 10) || 4000;

async function start() {
  // DB ping
  try {
    await db.testConnection();
  } catch (err) {
    console.warn("⚠  MySQL not connected:", err.message);
    console.warn("   Running without DB — set DB_* vars in .env\n");
  }

  // Uploads dir
  const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`\n🚀  ResumeAI API  →  http://localhost:${PORT}`);
    console.log(`    Health        →  http://localhost:${PORT}/health\n`);
  });

  process.on("SIGTERM", () => {
    server.close(() => { db.pool?.end(); process.exit(0); });
  });
}

start();

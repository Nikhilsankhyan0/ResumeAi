require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");
const morgan  = require("morgan");

const app = express();

// CORS
const allowed = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",").map(o => o.trim());

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

app.use(express.json({ limit:"10mb" }));
app.use(express.urlencoded({ extended:true, limit:"10mb" }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

app.get("/health", (req, res) =>
  res.json({ status:"ok", env:process.env.NODE_ENV, ts:new Date().toISOString() })
);

// All API routes
app.use("/api", require("./routes/index"));

// 404
app.use((req, res) =>
  res.status(404).json({ success:false, message:`${req.method} ${req.path} not found` })
);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status  = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV !== "production" ? err.message : "Internal server error";
  console.error(`[${status}] ${err.message}`);
  res.status(status).json({ success:false, message });
});

module.exports = app;

const { verifyAccessToken } = require("../utils/generateToken");

function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ success:false, message:"No token provided." });

  try {
    req.user = verifyAccessToken(header.split(" ")[1]);
    next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: expired ? "Token expired. Please log in again." : "Invalid token.",
    });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try { req.user = verifyAccessToken(header.split(" ")[1]); } catch { /* ignore */ }
  }
  next();
}

module.exports = { protect, optionalAuth };

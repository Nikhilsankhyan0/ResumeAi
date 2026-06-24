const jwt = require("jsonwebtoken");

const A_SECRET = process.env.JWT_SECRET          || "dev_secret_change_in_prod_32chars_min";
const R_SECRET = process.env.JWT_REFRESH_SECRET  || "dev_refresh_secret_change_in_prod";
const A_EXPIRY = process.env.JWT_EXPIRES_IN       || "7d";
const R_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

function generateAccessToken(payload) {
  return jwt.sign(payload, A_SECRET, { expiresIn: A_EXPIRY });
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, R_SECRET, { expiresIn: R_EXPIRY });
}

function verifyAccessToken(token)  { return jwt.verify(token, A_SECRET); }
function verifyRefreshToken(token) { return jwt.verify(token, R_SECRET); }

function buildTokenResponse(user) {
  const safe = { id:user.id, name:user.name, email:user.email,
                 title:user.title||null, location:user.location||null };
  return { user:safe, token:generateAccessToken(safe), refreshToken:generateRefreshToken(user.id) };
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, buildTokenResponse };

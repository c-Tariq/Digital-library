const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Hash password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      role_name: user.role_name,
    },
    process.env.JWT_SECRET || "My-secret-key-change-in-production",
    { expiresIn: "7d" }
  );
}

// Verify JWT token
function verifyToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "My-secret-key-change-in-production"
  );
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};

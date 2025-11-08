const { verifyToken } = require("../utils/auth");

const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    const token =
      req.headers.authorization?.split(" ")[1] || // Bearer TOKEN
      req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded; // { id, username, role_id, role_name }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;

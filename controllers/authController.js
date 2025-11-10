// controllers/authController.js
const db = require("../db/query");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");
const asyncHandler = require("../utils/asyncHandler");

// Validate password strength
function validatePasswordStrength(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
}

// Register new user
async function register(req, res) {
  const { username, email, password, role_name } = req.body;

  if (!username || !email || !password) {
    throw new BadRequestError("Username, email, and password are required");
  }

  // Validate password strength
  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length > 0) {
    throw new BadRequestError(passwordErrors.join(". "));
  }

  // Check if user exists
  const existingUser = await db.getUserByUsername(username);
  if (existingUser) {
    throw new BadRequestError("Username already exists");
  }

  const existingEmail = await db.getUserByEmail(email);
  if (existingEmail) {
    throw new BadRequestError("Email already exists");
  }

  const roleName = role_name || "viewer";
  const role = await db.getRoleByName(roleName);
  if (!role) {
    throw new NotFoundError(`Role '${roleName}' not found`);
  }

  const passwordHash = await hashPassword(password);

  const user = await db.createUser(username, email, passwordHash, role.id);

  const token = generateToken({
    id: user.id,
    username: user.username,
    role_id: role.id,
    role_name: role.name,
  });

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: role.name,
    },
  });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Username and password are required");
  }

  const user = await db.getUserByUsername(username);
  if (!user) {
    throw new NotFoundError("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new BadRequestError("Invalid credentials");
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role_id: user.role_id,
    role_name: user.role_name,
  });

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
    },
  });
}

// Get current user
async function getMe(req, res) {
  // req.user is set by authenticate middleware
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role_name,
    },
  });
}

// Render login page
function renderLogin(req, res) {
  res.render("login");
}

// Render register page
function renderRegister(req, res) {
  res.render("register");
}

module.exports = {
  register,
  login,
  getMe,
  renderLogin,
  renderRegister,
};

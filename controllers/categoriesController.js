// ─── CATEGORIES
const db = require("../db/query");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render("categoriesView", { categories });
}

async function getBooksByCategoryId(req, res) {
  const { id } = req.params;
  const books = await db.getBooksByCategoryId(id);
  res.render("index", { books });
}

async function addCategory(req, res) {
  const { name } = req.body;
  if (!name) throw new BadRequestError("Name is required");

  await db.addCategory(name);

  res.status(201).json({ message: "Category added successfully" });
}

async function removeCategory(req, res) {
  const { id } = req.params;

  await db.removeCategory(id);

  res.json({ message: "Category removed successfully" });
}

module.exports = {
  getAllCategories,
  getBooksByCategoryId,
  addCategory,
  removeCategory,
};

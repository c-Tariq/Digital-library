const db = require("../db/query");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

// ─── AUTHORS

async function getAllAuthors(req, res) {
  const authors = await db.getAllAuthors();
  res.render("authorsView", { authors });
}

async function addAuthor(req, res) {
  const { name, bio } = req.body;
  if (!name) throw new BadRequestError("Name is required");

  await db.addAuthor(name, bio);

  res.status(201).json({ message: "Author added successfully" });
}

async function getAuthorById(req, res) {
  const { id } = req.params;

  const author = await db.getAuthorById(id);
  if (!author) throw new NotFoundError("Author not found");

  res.render("authorView", { author });
}

async function updateAuthor(req, res) {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name) throw new BadRequestError("Name is required");

  const existingAuthor = await db.getAuthorById(id);
  if (!existingAuthor) throw new NotFoundError("Author not found");

  await db.updateAuthor(id, name, bio);

  res.json({ message: "Author updated successfully" });
}

async function removeAuthor(req, res) {
  const { id } = req.params;

  const existingAuthor = await db.getAuthorById(id);
  if (!existingAuthor) throw new NotFoundError("Author not found");

  await db.removeAuthor(id);

  res.json({ message: "Author removed successfully" });
}

module.exports = {
  getAllAuthors,
  addAuthor,
  getAuthorById,
  updateAuthor,
  removeAuthor,
};

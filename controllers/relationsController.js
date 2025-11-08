// ─── BOOK AUTHORS (Many-to-Many)
const db = require("../db/query");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

async function addBookAuthor(req, res) {
  const { book_id, author_id } = req.body;
  if (!book_id || !author_id) {
    throw new BadRequestError("Book ID and Author ID are required");
  }
  const book = await db.getBookById(book_id);
  const author = await db.getAuthorById(author_id);
  if (!book || !author) throw new NotFoundError("Book or author not found");

  await db.addBookAuthor(book_id, author_id);

  res.status(201).json({ message: "Author added to book successfully" });
}

async function removeBookAuthor(req, res) {
  const { book_id, author_id } = req.body;
  if (!book_id || !author_id) {
    throw new BadRequestError("Book ID and Author ID are required");
  }
  const book = await db.getBookById(book_id);
  const author = await db.getAuthorById(author_id);
  if (!book || !author) throw new NotFoundError("Book or author not found");
  await db.removeBookAuthor(book_id, author_id);

  res.json({ message: "Author removed from book successfully" });
}

// ─── BOOK CATEGORIES (Many-to-Many)

async function addBookCategory(req, res) {
  const { book_id, category_id } = req.body;
  if (!book_id || !category_id) {
    throw new BadRequestError("Book ID and Category ID are required");
  }
  const book = await db.getBookById(book_id);
  const categroy = await db.getCategoryById(category_id);
  if (!book || !categroy) throw new NotFoundError("Book or categroy not found");

  await db.addBookCategory(book_id, category_id);

  res.status(201).json({ message: "Category added to book successfully" });
}

async function removeBookCategory(req, res) {
  const { book_id, category_id } = req.body;
  if (!book_id || !category_id) {
    throw new BadRequestError("Book ID and Category ID are required");
  }
  const book = await db.getBookById(book_id);
  const categroy = await db.getCategoryById(category_id);
  if (!book || !categroy) throw new NotFoundError("Book or categroy not found");

  await db.removeBookCategory(book_id, category_id);

  res.json({ message: "Category removed from book successfully" });
}

module.exports = {
  // Relations
  addBookAuthor,
  removeBookAuthor,
  addBookCategory,
  removeBookCategory,
};

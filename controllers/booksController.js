const db = require("../db/query");
const path = require("path");
const fs = require("fs").promises;
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

// ─── BOOKS

async function getAllBooks(req, res) {
  const books = await db.getAllBooks();
  // res.json({ books });
  res.render("index", { books });
}

async function addBook(req, res) {
  const { title, publisher_id, description, pdf_path } = req.body;
  if (!title) throw new BadRequestError("Title is required");

  const newBook = await db.addBook(title, publisher_id, description, pdf_path);

  res.status(201).json({ message: "Book added successfully", book: newBook });
}

async function removeBook(req, res) {
  const { id } = req.params;

  const deletedBook = await db.removeBook(id);
  if (!deletedBook) throw new NotFoundError("Book not found");

  res.json({
    message: "Book removed successfully",
    book: deletedBook,
  });
}

async function getBookById(req, res) {
  const { id } = req.params;

  const book = await db.getBookById(id);
  if (!book) throw new NotFoundError("Book not found");

  res.render("bookView", { book });
}

async function updateBook(req, res) {
  const { id } = req.params;
  const { title, publisher_id } = req.body;
  if (!title) throw new BadRequestError("Title is required");

  const existingBook = await db.getBookById(id);
  if (!existingBook) throw new NotFoundError("Book not found");

  await db.updateBook(id, title, publisher_id);

  res.json({ message: "Book updated successfully" });
}

async function downloadBook(req, res) {
  const { id } = req.params;

  const book = await db.getBookById(id);
  if (!book) throw new NotFoundError("Book not found");

  if (!book.pdf_path) {
    throw new BadRequestError("PDF not available for this book");
  }

  const filePath = path.join(__dirname, "..", "public", book.pdf_path);
  console.log(filePath);
  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new NotFoundError("PDF file not found");
  }

  // Set headers for file download
  const fileName = `${book.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "application/pdf");

  // Send the file
  res.sendFile(path.resolve(filePath));
}

// ─── EXPORTS

module.exports = {
  getAllBooks,
  addBook,
  removeBook,
  getBookById,
  updateBook,
  downloadBook,
};

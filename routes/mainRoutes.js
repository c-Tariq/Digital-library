const { Router } = require("express");
const authorController = require("../controllers/authorsController");
const booksController = require("../controllers/booksController");
const categoriesController = require("../controllers/categoriesController");
const publishersController = require("../controllers/publishersController");
const relationsController = require("../controllers/relationsController");
const authController = require("../controllers/authController");

// Middleware
const authenticate = require("../middleware/auth");
const {
  canCreate,
  canRead,
  canUpdate,
  canDelete,
} = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");

const mainRouter = Router();

// ─── AUTH ROUTES (Public) ─────────────────────────────
mainRouter.post("/auth/register", asyncHandler(authController.register));
mainRouter.post("/auth/login", asyncHandler(authController.login));
mainRouter.get("/auth/me", authenticate, asyncHandler(authController.getMe));

// ─── PUBLIC ROUTES ────────────────────────────────────
mainRouter.get("/", (req, res) => {
  res.redirect("/books");
});

mainRouter.get("/books", booksController.getAllBooks);
mainRouter.get("/books/:id", booksController.getBookById);
mainRouter.get("/books/:id/download", booksController.downloadBook);

mainRouter.get("/authors", authorController.getAllAuthors);
mainRouter.get("/authors/:id", authorController.getAuthorById);

mainRouter.get("/categories", categoriesController.getAllCategories);
mainRouter.get("/categories/:id", categoriesController.getBooksByCategoryId);

mainRouter.get("/publishers", publishersController.getAllPublishers);

// ─── PROTECTED ROUTES ──────────────────────────────────

// Books
mainRouter.post(
  "/books",
  authenticate,
  canCreate("books"),
  asyncHandler(booksController.addBook)
);
mainRouter.put(
  "/books/:id",
  authenticate,
  canUpdate("books"),
  asyncHandler(booksController.updateBook)
);
mainRouter.delete(
  "/books/:id",
  authenticate,
  canDelete("books"),
  asyncHandler(booksController.removeBook)
);

// Authors
mainRouter.post(
  "/authors",
  authenticate,
  canCreate("authors"),
  asyncHandler(authorController.addAuthor)
);
mainRouter.put(
  "/authors/:id",
  authenticate,
  canUpdate("authors"),
  asyncHandler(authorController.updateAuthor)
);
mainRouter.delete(
  "/authors/:id",
  authenticate,
  canDelete("authors"),
  asyncHandler(authorController.removeAuthor)
);

// Categories
mainRouter.post(
  "/categories",
  authenticate,
  canCreate("categories"),
  asyncHandler(categoriesController.addCategory)
);
mainRouter.delete(
  "/categories/:id",
  authenticate,
  canDelete("categories"),
  asyncHandler(categoriesController.removeCategory)
);

// Publishers
mainRouter.post(
  "/publishers",
  authenticate,
  canCreate("publishers"),
  asyncHandler(publishersController.addPublisher)
);
mainRouter.delete(
  "/publishers/:id",
  authenticate,
  canDelete("publishers"),
  asyncHandler(publishersController.removePublisher)
);

// Relations
mainRouter.post(
  "/books/:book_id/authors/:author_id",
  authenticate,
  canCreate("books"), // or create a separate permission
  asyncHandler(relationsController.addBookAuthor)
);
mainRouter.delete(
  "/books/:book_id/authors/:author_id",
  authenticate,
  canDelete("books"),
  asyncHandler(relationsController.removeBookAuthor)
);
mainRouter.post(
  "/books/:book_id/categories/:category_id",
  authenticate,
  canCreate("books"),
  asyncHandler(relationsController.addBookCategory)
);
mainRouter.delete(
  "/books/:book_id/categories/:category_id",
  authenticate,
  canDelete("books"),
  asyncHandler(relationsController.removeBookCategory)
);

module.exports = mainRouter;

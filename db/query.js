const pool = require("./pool");

async function getAllBooks() {
  const result = await pool.query(`
    SELECT
      b.id,
      b.title,
      p.name AS publisher_name,
      a.name AS author_name,
      b.pdf_path,
      ARRAY_AGG(DISTINCT a.name) AS authors,
      ARRAY_AGG(DISTINCT c.name) AS categories
    FROM books b
    JOIN publishers p ON b.publisher_id = p.id
    JOIN book_authors ba ON b.id = ba.book_id
    JOIN authors a ON ba.author_id = a.id
    JOIN book_categories bc ON b.id = bc.book_id
    JOIN categories c ON bc.category_id = c.id
    GROUP BY b.id, b.title, b.pdf_path, p.name, a.name
  `);
  return result.rows; // return all books
}

async function addBook(
  title,
  publisher_id,
  description = null,
  pdf_path = null
) {
  const result = await pool.query(
    `INSERT INTO books (title, publisher_id, description, pdf_path)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [title, publisher_id, description, pdf_path]
  );
  return result.rows[0];
}
async function removeBook(id) {
  const result = await pool.query(
    "DELETE FROM books WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function getBookById(id) {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.title,
      b.description,
      b.created_at,
      b.pdf_path,
      p.name AS publisher_name,
      a.name AS author_name,
      a.id AS author_id,
      ARRAY_AGG(DISTINCT a.name) AS authors,
      ARRAY_AGG(DISTINCT c.name) AS categories
    FROM books b
    JOIN publishers p ON b.publisher_id = p.id
    JOIN book_authors ba ON b.id = ba.book_id
    JOIN authors a ON ba.author_id = a.id
    JOIN book_categories bc ON b.id = bc.book_id
    JOIN categories c ON bc.category_id = c.id
    WHERE b.id = $1
    GROUP BY b.id, b.title, b.pdf_path, p.name, a.name, a.id;
  `,
    [id]
  );

  return result.rows[0]; // return single book
}

async function updateBook(id, title, publisher_id) {
  await pool.query(
    "UPDATE books SET title = $1, publisher_id = $2 WHERE id = $3",
    [title, publisher_id, id]
  );
}

// -------------authors

async function getAllAuthors() {
  const result = await pool.query("SELECT * FROM authors ORDER BY name");
  return result.rows;
}

async function addAuthor(name, bio) {
  await pool.query("INSERT INTO authors (name, bio) VALUES ($1, $2)", [
    name,
    bio,
  ]);
}

async function getAuthorById(id) {
  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
  return result.rows[0];
}

async function updateAuthor(id, name, bio) {
  await pool.query("UPDATE authors SET name = $1, bio = $2 WHERE id = $3", [
    name,
    bio,
    id,
  ]);
}

async function removeAuthor(id) {
  await pool.query("DELETE FROM authors WHERE id = $1", [id]);
}

//---------------Ctegories

async function getAllCategories() {
  const result = await pool.query("SELECT * FROM categories ORDER BY name");
  return result.rows;
}
async function getBooksByCategoryId(category_id) {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.title,
      b.description,
      b.pdf_path,
      p.name AS publisher_name,
      ARRAY_AGG(DISTINCT a.name) AS authors,
      ARRAY_AGG(DISTINCT c.name) AS categories
    FROM books b
    JOIN publishers p ON b.publisher_id = p.id
    JOIN book_authors ba ON b.id = ba.book_id
    JOIN authors a ON ba.author_id = a.id
    JOIN book_categories bc ON b.id = bc.book_id
    JOIN categories c ON bc.category_id = c.id
    WHERE bc.category_id = $1
    GROUP BY b.id, b.title, b.description, b.pdf_path, p.name
  `,
    [category_id]
  );
  return result.rows;
}

async function addCategory(name) {
  await pool.query("INSERT INTO categories (name) VALUES ($1)", [name]);
}

async function getCategroryById(id) {
  await pool.query("SELECT * FROM category WHERE id = $1", [id]);
}

async function removeCategory(id) {
  await pool.query("DELETE FROM categories WHERE id = $1", [id]);
}

// ─── PUBLISHERS ─────────────────────────────────────────────
//
async function getAllPublishers() {
  const result = await pool.query("SELECT * FROM publishers ORDER BY name");
  return result.rows;
}

async function addPublisher(name) {
  await pool.query("INSERT INTO publishers (name) VALUES ($1)", [name]);
}

async function removePublisher(id) {
  await pool.query("DELETE FROM publishers WHERE id = $1", [id]);
}

// ─── BOOK AUTHORS (Many-to-Many) ─────────────────────────────
//
async function addBookAuthor(book_id, author_id) {
  await pool.query(
    "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
    [book_id, author_id]
  );
}

async function removeBookAuthor(book_id, author_id) {
  await pool.query(
    "DELETE FROM book_authors WHERE book_id = $1 AND author_id = $2",
    [book_id, author_id]
  );
}

// ─── BOOK CATEGORIES (Many-to-Many) ─────────────────────────────
//
async function addBookCategory(book_id, category_id) {
  await pool.query(
    "INSERT INTO book_categories (book_id, category_id) VALUES ($1, $2)",
    [book_id, category_id]
  );
}

async function removeBookCategory(book_id, category_id) {
  await pool.query(
    "DELETE FROM book_categories WHERE book_id = $1 AND category_id = $2",
    [book_id, category_id]
  );
}

// ─── USERS & AUTH ─────────────────────────────────────────────

async function getUserByUsername(username) {
  const result = await pool.query(
    `
    SELECT u.*, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.username = $1
  `,
    [username]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `
    SELECT u.*, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
  `,
    [email]
  );
  return result.rows[0];
}

async function createUser(username, email, passwordHash, roleId) {
  const result = await pool.query(
    `
    INSERT INTO users (username, email, password_hash, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role_id, created_at
  `,
    [username, email, passwordHash, roleId]
  );
  return result.rows[0];
}

async function getAllRoles() {
  const result = await pool.query("SELECT * FROM roles ORDER BY id");
  return result.rows;
}

async function getRoleByName(name) {
  const result = await pool.query("SELECT * FROM roles WHERE name = $1", [
    name,
  ]);
  return result.rows[0];
}

//
// ─── EXPORTS ─────────────────────────────────────────────
//
module.exports = {
  // Books
  getAllBooks,
  addBook,
  removeBook,
  getBookById,
  updateBook,

  // Authors
  getAllAuthors,
  addAuthor,
  getAuthorById,
  updateAuthor,
  removeAuthor,

  // Categories
  getAllCategories,
  getBooksByCategoryId,
  addCategory,
  removeCategory,

  // Publishers
  getAllPublishers,
  addPublisher,
  removePublisher,

  // Relations
  addBookAuthor,
  removeBookAuthor,
  addBookCategory,
  removeBookCategory,

  // Users & Auth
  getUserByUsername,
  getUserByEmail,
  createUser,
  getAllRoles,
  getRoleByName,
};

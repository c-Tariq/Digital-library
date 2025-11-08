#! /usr/bin/env node

const pool = require("./pool");

const SQL = `
  -- Delete junction tables first (due to foreign keys)
  DELETE FROM book_authors;
  DELETE FROM book_categories;
  
  -- Delete main tables
  DELETE FROM books;
  DELETE FROM authors;
  DELETE FROM categories;
  DELETE FROM publishers;
`;

async function main() {
  try {
    await pool.query(SQL);
    console.log("All database content cleared successfully!");
  } catch (err) {
    console.error("Error clearing database:", err);
  } finally {
    await pool.end();
  }
}

main();

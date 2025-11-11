
# 📚 Book Store

An Express.js application for managing a small online library. It supports browsing and managing books, authors, categories, and publishers, all stored in a **PostgreSQL** database. The app includes **JWT authentication** and **role-based access control** for secure operations.

---

##  Key Features

* Express 5 backend with clean routes, controllers, and middleware.
* PostgreSQL database using a lightweight query module.
* JWT authentication with admin, editor, and viewer roles.
* File-backed library: metadata in Postgres, PDFs in `public/uploads/books`.
* EJS templates for pages; JSON API for future SPA or mobile use.

---

##  Structure Overview

* `app.js` – sets up Express, middleware, routes, and error handling.
* `routes/mainRoutes.js` – main router that connects endpoints to controllers.
* `controllers/` – handles logic for books, authors, categories, publishers, and auth.
* `db/query.js` – contains all SQL queries and database functions.
* `middleware/auth.js` – validates JWTs.
* `middleware/authorize.js` – checks user roles before actions.
* `utils/auth.js` – handles password hashing and token signing.

The schema includes tables for books, authors, categories, publishers, users, and roles. Seeding scripts (`db/seed.js`, `db/usersSeed.js`) fill the database with sample data.

---

## ⚙️ Getting Started

### Requirements

* Node.js 18+
* PostgreSQL 14+

### Setup

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
DB_NAME=book_store
JWT_SECRET=change-me
```

Initialize the database:

```bash
node db/populate.js
node db/seed.js
node db/usersSeed.js
```

Run the app:

```bash
npm run dev
# or
npm start
```

---

##  Main Endpoints

* `GET /books` – list all books
* `GET /books/:id` – view book details
* `GET /books/:id/download` – download book PDF
* `POST /auth/register`, `POST /auth/login`, `GET /auth/me` – auth routes
* `POST/PUT/DELETE /books`, `/authors`, `/categories`, `/publishers` – admin/editor only



---

## Future Improvements

* Add tests for controllers and DB logic.
* Use migrations for schema updates.
* Generate OpenAPI docs for API clients.



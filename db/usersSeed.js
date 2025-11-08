#! /usr/bin/env node

const db = require("./query");
const pool = require("./pool");
const { hashPassword } = require("../utils/auth");

async function seedRolesAndUsers() {
  try {
    console.log("Seeding roles and users...");

    // ─── Create Roles ──────────────────────────────────
    await pool.query(`
      INSERT INTO roles (name, description) VALUES
      ('admin', 'Full access to all resources'),
      ('editor', 'Can create, read, and update resources'),
      ('viewer', 'Read-only access')
      ON CONFLICT (name) DO NOTHING
    `);

    // Get roles
    const roles = await db.getAllRoles();
    const adminRole = roles.find((r) => r.name === "admin");
    const editorRole = roles.find((r) => r.name === "editor");
    const viewerRole = roles.find((r) => r.name === "viewer");

    // ─── Create Users ──────────────────────────────────
    const adminPassword = await hashPassword("admin123");
    const editorPassword = await hashPassword("editor123");
    const viewerPassword = await hashPassword("viewer123");

    // Check if users exist
    const existingAdmin = await db.getUserByUsername("admin");
    if (!existingAdmin) {
      await db.createUser(
        "admin",
        "admin@bookstore.com",
        adminPassword,
        adminRole.id
      );
      console.log("Created admin user (username: admin, password: admin123)");
    }

    const existingEditor = await db.getUserByUsername("editor");
    if (!existingEditor) {
      await db.createUser(
        "editor",
        "editor@bookstore.com",
        editorPassword,
        editorRole.id
      );
      console.log(
        " Created editor user (username: editor, password: editor123)"
      );
    }

    const existingViewer = await db.getUserByUsername("viewer");
    if (!existingViewer) {
      await db.createUser(
        "viewer",
        "viewer@bookstore.com",
        viewerPassword,
        viewerRole.id
      );
      console.log(
        " Created viewer user (username: viewer, password: viewer123)"
      );
    }

    console.log("Roles and users seeded successfully!");
  } catch (err) {
    console.error("Error seeding roles and users:", err);
  } finally {
    await pool.end();
  }
}

seedRolesAndUsers();

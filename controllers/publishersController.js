// ─── PUBLISHERS
const db = require("../db/query");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

async function getAllPublishers(req, res) {
  const publishers = await db.getAllPublishers();
  res.json({ publishers });
}

async function addPublisher(req, res) {
  const { name } = req.body;
  if (!name) throw new BadRequestError("Name is required");

  await db.addPublisher(name);

  res.status(201).json({ message: "Publisher added successfully" });
}

async function removePublisher(req, res) {
  const { id } = req.params;

  await db.removePublisher(id);

  res.json({ message: "Publisher removed successfully" });
}

module.exports = {
  // Publishers
  getAllPublishers,
  addPublisher,
  removePublisher,
};

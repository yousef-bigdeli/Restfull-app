const express = require("express");
const router = express.Router();
const { Genre, validateBody } = require("../models/genres");
const { validationId } = require("../utils/validationMongoId");

// Get all data
router.get("/", async (req, res) => {
  const result = await Genre.find().sort("name");
  res.send(result);
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

// Create data
router.post("/", async (req, res) => {
  const { error } = validateBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre(req.body);

  try {
    genre = await genre.save();
    res.send(genre);
  } catch (err) {
    res.status(500).send("Server Error.");
    console.error(err);
  }
});

// Update data by id
router.put("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const { error } = validateBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

// delete data by id
router.delete("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;

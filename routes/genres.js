const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// Model
const Genre = mongoose.model("genre", {
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  date: { type: Date, default: Date.now },
});

// Get all data
router.get("/", async (req, res) => {
  const result = await Genre.find().sort("name");
  res.send(result);
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const isValidId = validateId(req.params.id);
  if (isValidId) {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  } else {
    res
      .status(400)
      .send(
        "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
      );
  }
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
    console.error(err);
  }
});

// Update data by id
router.put("/:id", async (req, res) => {
  const isValidId = validateId(req.params.id);
  if (isValidId) {
    const { error } = validateBody(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } else {
    res
      .status(400)
      .send(
        "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
      );
  }
});

// delete data by id
router.delete("/:id", async (req, res) => {
  const isValidId = validateId(req.params.id);
  if (isValidId) {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } else {
    res
      .status(400)
      .send(
        "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
      );
  }
});

module.exports = router;

// Validate request
function validateBody(body) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(255),
  });
  return schema.validate(body);
}

function validateId(id) {
  return id.length === 12 || id.length === 24;
}

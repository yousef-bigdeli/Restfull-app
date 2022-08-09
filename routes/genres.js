const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("Connected to the MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB ", err));

// Sceham
const genresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  date: { type: Date, default: Date.now },
});

// Model
const Genre = mongoose.model("genre", genresSchema);

// Get all data
router.get("/", async (req, res) => {
  const result = await Genre.find().sort("name");
  res.send(result);
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const isValidId = validateId(req.params.id);
  if (isValidId) {
    const result = await Genre.findById(req.params.id).sort("name");
    if (result) {
      res.send(result);
    } else {
      res.status(404).send("Genre with the given id is not defind.");
    }
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

  const newGenre = new Genre(req.body);

  try {
    const result = newGenre.save();
    res.send(newGenre);
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

    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).send("Genre with the given id is not defind.");
    } else {
      genre.name = req.body.name;
    }

    try {
      const result = await genre.save();
      res.send(result);
    } catch (err) {
      console.error(err);
    }
  } else {
    res
      .status(400)
      .send(
        "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
      );
  }
});

// delete data by id

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

const express = require("express");
const router = express.Router();
const { Movie, validateBody, validateId } = require("../models/movies");
const { Genre } = require("../models/genres");

// Get all data
router.get("/", async (req, res) => {
  const result = await Movie.find().sort("name");
  res.send(result);
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const isValidId = validateId(req.params.id);
  if (isValidId) {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
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

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    movie = await movie.save();
    res.send(movie);
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

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
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
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } else {
    res
      .status(400)
      .send(
        "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
      );
  }
});

module.exports = router;

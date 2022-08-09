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

// delete data by id

module.exports = router;

// Validate request
function validateBody(body) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(255),
  });
  return schema.validate(body);
}


const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
});

const Movie = mongoose.model(
  "movies",
  new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 255 },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, default: 0, min: 0, max: 255 },
    dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 },
    date: { type: Date, default: Date.now },
  })
);

// Validate request
function validateBody(body) {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(255),
    genreId: joiObjectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });
  return schema.validate(body);
}

exports.Movie = Movie;
exports.validateBody = validateBody;

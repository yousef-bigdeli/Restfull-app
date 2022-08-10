const Joi = require("joi");
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  phone: { type: String, required: true, minlength: 9, maxlength: 11 },
  isGold: { type: Boolean, default: false },
});

const Rental = mongoose.model(
  "rental",
  new mongoose.Schema({
    customer: { type: customerSchema },
    movie: { type: movieSchema },
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
  })
);

function validateReqBody(body) {
  const schema = Joi.object({
    movieId: Joi.string().required(),
    customerId: Joi.string().required(),
  });

  return schema.validate(body);
}

function validateId(id) {
  const isValid = id.length === 12 || id.length === 24;
  return !isValid
    ? "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
    : null;
}

exports.Rental = Rental;
exports.validateReqBody = validateReqBody;
exports.validateId = validateId;

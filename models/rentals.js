const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

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
    movieId: joiObjectId().required(),
    customerId: joiObjectId().required(),
  });

  return schema.validate(body);
}

exports.Rental = Rental;
exports.validateReqBody = validateReqBody;

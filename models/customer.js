const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    isGold: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 11,
    },
    date: { type: Date, default: Date.now },
  })
);

// Validate request
function validateBody(body) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(255),
    isGold: Joi.boolean(),
    phone: Joi.string().required().min(9).max(11).pattern(/^\d+$/),
  });
  return schema.validate(body);
}

function validateId(id) {
  return id.length === 12 || id.length === 24;
}

exports.Customer = Customer;
exports.validateBody = validateBody;
exports.validateId = validateId;

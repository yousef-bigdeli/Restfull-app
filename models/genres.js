const mongoose = require("mongoose");
const Joi = require("joi");

const Genre = mongoose.model("genre", {
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  date: { type: Date, default: Date.now },
});

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

exports.Genre = Genre;
exports.validateBody = validateBody;
exports.validateId = validateId;

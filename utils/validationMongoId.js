const mongoose = require("mongoose");

exports.validationId = function validationId(id) {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  const validation = { message: "", isValid: true };

  if (!isValidId) {
    validation.message = "Given id fails to match the valid id pattern";
    validation.isValid = false;
  }

  return validation;
};

const express = require("express");
const router = express.Router();
const { Customer, validateBody, validateId } = require("../models/customer");

// Get all data
router.get("/", async (req, res) => {
  const result = await Customer.find().sort("name");
  res.send(result);
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const isValidId = validateId(req.params.id);
  if (isValidId) {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      res.status(404).send("The customer with the given ID was not found.");
    res.send(customer);
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

  let customer = new Customer(req.body);

  try {
    customer = await customer.save();
    res.send(customer);
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

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
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
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  } else {
    res
      .status(400)
      .send(
        "Given id must be a string of 12 bytes or a string of 24 hex characters or an integer"
      );
  }
});

module.exports = router;

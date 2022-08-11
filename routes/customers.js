const express = require("express");
const router = express.Router();
const { Customer, validateBody } = require("../models/customer");
const { validationId } = require("../utils/validationMongoId");

// Get all data
router.get("/", async (req, res) => {
  const result = await Customer.find().sort("name");
  res.send(result);
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  res.send(customer);
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
    res.status(500).send("Server Error.");
  }
});

// Update data by id
router.put("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

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
});

// delete data by id
router.delete("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  res.send(customer);
});

module.exports = router;

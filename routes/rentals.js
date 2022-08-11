const express = require("express");
const router = express.Router();
const conn = require("../models/connection");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movies");
const { Rental, validateReqBody } = require("../models/rentals");
const { validationId } = require("../utils/validationMongoId");

router.get("/", async (req, res) => {
  const result = await Rental.find().sort("-dateOut");
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const result = await Rental.findById(req.params.id);
  if (!result)
    return res.status(404).send("The rental with the given ID was not found.");
  res.send(result);
});

router.post("/", async (req, res) => {
  const { error } = validateReqBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  const session = await conn.startSession();
  session.startTransaction();

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
  });

  try {
    rental = await rental.save({ session });
    await Movie.updateOne(
      { _id: movie._id },
      { $inc: { numberInStock: -1 } },
      { session }
    );
    await session.commitTransaction();
    res.send(rental);
  } catch (err) {
    res.status(500).send("Server error");
    console.error(err);
    await session.abortTransaction();
  }
  session.endSession();
});

router.put("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  res.send("result");
});

router.delete("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;

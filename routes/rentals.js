const express = require("express");
const router = express.Router();
const conn = require("../models/connection"); // import connection for transactions
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

/*
  >> To use transaction in mongodb, run mongodb replica set instead of standalone (in development)
*/

router.post("/", async (req, res) => {
  // validation request body with Joi
  const { error } = validateReqBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Get Customer and Movie for add to the Rental document
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  // Start session and Transaction
  const session = await conn.startSession();
  session.startTransaction();

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  // Create Rental document
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
    // Insert document and update Movie document in a transaction
    rental = await rental.save({ session });
    await Movie.updateOne(
      { _id: movie._id },
      { $inc: { numberInStock: -1 } },
      { session }
    );
    await session.commitTransaction(); // End transaction
    res.send(rental);
  } catch (err) {
    res.status(500).send("Server error");
    console.error(err);
    await session.abortTransaction();
  }
  session.endSession(); // End of session and transaction
});

router.put("/:id", async (req, res) => {
  const { message, isValid } = validationId(req.params.id);
  if (!isValid) return res.status(400).send(message);

  // TODO: Add update logic
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

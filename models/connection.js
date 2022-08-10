const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

const conn = mongoose.connection;

conn.on("error", () =>
  console.error.bind(console, "Could not connect to MongoDB")
);

conn.once("open", () => console.info("Connected to the MongoDB..."));

module.exports = conn;

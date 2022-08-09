const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genres = require("./routes/genres");

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("Connected to the MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB ", err));

app.use(express.json());
app.use("/api/genres", genres);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

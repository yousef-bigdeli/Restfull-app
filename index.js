const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const genres = require("./routes/genres");

app.use(express.json());
app.use("/api/genres", genres);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

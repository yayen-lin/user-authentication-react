// requires dependencies
const path = require("path");
const express = require("express");
const app = express();
const mysql = require("mysql");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
console.log("PORT=", process.env.PORT || "undefined");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

const db = mysql.createPool({
  host: "taipeinerd.com",
  user: "ggdabhmy_admin",
  password: process.env.DB_PASSWORD,
  database: "ggdabhmy_sampledb",
  connectionLimit: 5,
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/", (req, res) => {
  const sqlInsert =
    "INSERT INTO movieReviews (movieName, movieReview) VALUES ('inception', 'good movie')";

  db.query(sqlInsert, (err, result) => {
    res.send("Done inserting!");
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server! - MOJO" });
});

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

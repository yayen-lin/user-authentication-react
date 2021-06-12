// requires dependencies
const path = require("path");
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors"); // enable cross-origin resource sharing in express
require("dotenv").config();

const PORT = process.env.PORT || 3001;

// const corsOptions = {
//   origin: ["http://www.carmax168.com", "http://localhost:" + PORT],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json());
// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

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

// app.get("/", (req, res) => {
// const sqlInsert =
//   "INSERT INTO movieReviews (movieName, movieReview) VALUES ('inception', 'good movie')";

// db.query(sqlInsert, (err, result) => {
//   res.send("Done inserting!");
// });
// });

app.post("/api/insert", (req, res) => {
  const sqlInsert =
    "INSERT INTO movieReviews (movieName, movieReview) VALUES (?, ?)";

  const movieName = req.body.movieName;
  const movieReview = req.body.movieReview;

  db.query(sqlInsert, [movieName, movieReview], (err, result) => {
    res.send("Done inserting!");
    console.log("Done inserting!");
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server! - MOJO" });
});

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

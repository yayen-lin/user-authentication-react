// requires dependencies
const path = require("path");
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors"); // enable cross-origin resource sharing in express
require("dotenv").config();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const PORT = process.env.PORT || 3001;

// const corsOptions = {
//   origin: ["http://www.carmax168.com", "http://localhost:" + PORT],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: "taipeinerd.com",
  user: "ggdabhmy_admin",
  password: process.env.DB_PASSWORD,
  database: "ggdabhmy_carmax168",
  connectionLimit: 5,
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.post("/api/insert", (req, res) => {
//   const sqlInsert =
//     "INSERT INTO movieReviews (movieName, movieReview) VALUES (?, ?)";

//   const movieName = req.body.movieName;
//   const movieReview = req.body.movieReview;

//   db.query(sqlInsert, [movieName, movieReview], (err, result) => {
//     res.send("Done inserting!");
//     console.log("Done inserting!");
//   });
// });

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const privilege = req.body.privilege;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO users (username, password, privilege) VALUES (?, ?, ?);",
      [username, hash, privilege],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // hash + salt
  bcrypt.hash(password.saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "SELECT * FROM users WHERE username = ?;",
      [username],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              // login successfully
              res.send(result);
            } else {
              res.send({ message: "Wrong username or password!" });
            }
          });
        } else {
          res.send({ message: "User doesn't exist!" });
        }
      }
    );
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server! - MOJO" });
});

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

// requires dependencies
const path = require("path");
const express = require("express");
const app = express();
// enable environment variable to be read
require("dotenv").config();
// enable cross-origin resource sharing in express
const cors = require("cors");
// mysql
const mysql = require("mysql");
// hasing and salting
const bcrypt = require("bcrypt");
const saltRounds = 10;
// parsing req.body element from the frontend
const bodyParser = require("body-parser");
// parse cookie
const cookieParser = require("cookie-parser");
// creating session and maintaining (keeps users logged in)
const session = require("express-session");

// settings
const PORT = process.env.PORT || 3001;
const corsOptions = {
  // access-control-allow-origin
  origin: [
    "https://www.carmax168.com",
    "http://localhost:3000",
    // "http://localhost:" + PORT,
  ],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // allowing cookie to be enabled (access-control-allow-credentials)
};
const db = mysql.createPool({
  host: "taipeinerd.com",
  user: "ggdabhmy_admin",
  password: process.env.DB_PASSWORD,
  database: "ggdabhmy_carmax168",
  connectionLimit: 5,
});
const sess = {
  key: "userId", // name of the cookie we create
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 24, // cookie expires in 24 hrs
  },
};

app.use(express.json());
app.use(cors(corsOptions));
// app.use(cors());
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "https://www.carmax168.com",
//     "http://localhost:3000",
//     "http://localhost:" + PORT,
//   ];
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sess));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

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

// see if the user is logged in
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
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
              req.session.user = result; // create a session
              console.log(req.session.user);
              res.send(result);
            } else {
              // login fail
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

// Last case: url not found
app.get("/*", function (req, res) {
  res.json({ message: "404 Not found" });
});

// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from server! - MOJO" });
// });

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

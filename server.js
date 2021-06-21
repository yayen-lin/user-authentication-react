// ----------------------- requires dependencies -----------------------
const path = require("path");
const express = require("express");
// enable environment variable to be read
require("dotenv").config();
// enable cross-origin resource sharing in express
const cors = require("cors");
// mysql
const mysql = require("mysql");
// (authorization)
// hasing and salting
const bcrypt = require("bcrypt");
// const saltRounds = 10;
// parsing req.body element from the frontend
const bodyParser = require("body-parser");
// parse cookie
const cookieParser = require("cookie-parser");
// creating session and maintaining (keeps users logged in)
const session = require("express-session");
// (authentication)
// json web token, needed for logged in users to make every api requests
const jwt = require("jsonwebtoken");

// ----------------------- settings -----------------------
const PORT = process.env.PORT || 3000;
// const corsOptions = {
//   // access-control-allow-origin
//   origin: [
//     "https://www.carmax168.com",
//     "http://localhost:8081",
//     // "http://localhost:" + PORT,
//   ],
//   methods: ["GET", "PUT", "POST", "DELETE"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "Origin",
//     "X-Requested-With",
//     "Accept",
//     "X-Access-Token",
//   ],
//   credentials: true, // allowing cookie to be enabled (access-control-allow-credentials)
// };
// const db = mysql.createPool({
//   host: "taipeinerd.com",
//   user: "ggdabhmy_admin",
//   password: process.env.DB_PASSWORD,
//   database: "ggdabhmy_carmax168",
//   connectionLimit: 5,
// });
const sess = {
  key: "userId", // name of the cookie we create
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 24, // cookie expires in 24 hrs
  },
};

// ----------------------- init -----------------------
const app = express();
app.use(express.json());
// app.use(cors(corsOptions));
// app.use(cors());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "https://www.carmax168.com",
    // "http://localhost:3000",
    "http://localhost:" + PORT,
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sess));

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, "../client/build")));

// bad practice to use global in JS
global.jwt = jwt;
global.bcrypt = bcrypt;

// ----------------------- configuring -----------------------

// app.post("/register", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const privilege = req.body.privilege;

//   bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) {
//       console.log(err);
//     }
//     db.query(
//       "INSERT INTO users (username, password, privilege) VALUES (?, ?, ?);",
//       [username, hash, privilege],
//       (err, result) => {
//         console.log(err);
//       }
//     );
//   });
// });

// const verifyJWT = (req, res, next) => {
//   const token = req.headers["x-access-token"]; // grabbing token from header

//   if (!token) {
//     res.send("Yo, we need a token, please give it to us next time!");
//   } else {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         // fail to authenticate
//         res.json({ auth: false, message: "Failed to authenticate" });
//       } else {
//         req.userId = decoded.id; // saving the decoded id (token) for further verifications/authenticated requests.
//         next();
//       }
//     });
//   }
// };

// app.get("/isUserAuth", verifyJWT, (req, res) => {
//   res.send("YOYOYO! You are authenticated!");
// });

// see if the user is logged in
// app.get("/login", (req, res) => {
//   if (req.session.user) {
//     res.send({ loggedIn: true, user: req.session.user });
//   } else {
//     res.send({ loggedIn: false });
//   }
// });

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   // console.log(typeof password); // string

//   // hash + salt
//   bcrypt.hash(password.saltRounds, (err, hash) => {
//     // TODO: Error: data must be a string or Buffer and salt must
//     // either be a salt string or a number of rounds
//     if (err) {
//       console.log(err);
//     }

//     db.query(
//       "SELECT * FROM users WHERE username = ?;",
//       [username],
//       (err, result) => {
//         if (err) {
//           res.send({ err: err });
//         }
//         if (result.length > 0) {
//           bcrypt.compare(password, result[0].password, (error, response) => {
//             if (response) {
//               // login successfully
//               console.log("Logged in successfully!");

//               // create a jwt
//               const id = result[0].user_id;
//               const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                 expiresIn: 300, // 5 mins
//               });

//               req.session.user = result; // create a session
//               console.log(req.session.user);

//               // res.send(result);
//               res.json({
//                 auth: true, // authorized
//                 token: token,
//                 result: result,
//               });
//             } else {
//               // login fail
//               res.json({ auth: false, message: "Wrong username or password!" });
//             }
//           });
//         } else {
//           res.json({ auth: false, message: "User doesn't exist!" });
//         }
//       }
//     );
//   });
// });

// ----------------------- import routes -----------------------
const authRoutes = require("./backend/routes/auth.routes");
app.use("/", authRoutes);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// when a url not found
app.get("/*", function (req, res) {
  res.json({ message: "404 Not found" });
});

// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from server! - MOJO" });
// });

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

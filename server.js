/**
 * server.js - where backend is, starting of our backend
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// ----------------------- dependencies -----------------------
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
// store session data in mysql
const mysqlStore = require("express-mysql-session")(session);
// (authentication)
// json web token, needed for logged in users to make every api requests
const jwt = require("jsonwebtoken");

// ----------------------- settings -----------------------
// default env setting
const {
  PORT = 3000,
  SESSION_NAME = "sid",
  SESSION_LIFETIME = 2, // two hours
  NODE_ENV = "development",
} = process.env;

const IN_PROD = NODE_ENV === "production";

var sessionStore = new mysqlStore({
  // db config
  host: "taipeinerd.com",
  user: "ggdabhmy_admin",
  password: process.env.DB_PASSWORD,
  database: "ggdabhmy_carmax168",
  // store setting
  expiration: 1000 * 60 * 60 * 12, // session cookie expires in 12 hrs
  createDatabaseTable: true,
  clearExpired: true,
  checkExpirationInterval: 900000, // clear expired session every 15 mins
  connectionLimit: 1,
  endConnectionOnClose: true,
  // charset: "utf8mb4_bin",
  schema: {
    tableName: "sessions_table",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
});

// default value is { path: '/', httpOnly: true, secure: false, maxAge: null }
const sessOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // not to store the session back to storage if they were never modified in the request
  saveUninitialized: false, // not to save any uninitialized session that has no data
  store: sessionStore, // session data is stored in mysql db
  cookie: {
    maxAge: 1000 * 60 * 60 * process.env.SESSION_LIFETIME,
    sameSite: true, // or 'strict', same effect
    secure: IN_PROD,
  }, // session cookie expires in 12 hrs
};

// ----------------------- init -----------------------
const app = express();
app.use(express.json());
// app.use(cors(corsOptions));
// app.use(cors());
app.use((req, res, next) => {
  const allowedOrigins = ["https://www.carmax168.com", "http://localhost:8081"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessOptions));

// bad practice to use global in JS
global.jwt = jwt;
global.bcrypt = bcrypt;

// ----------------------- import routes -----------------------
const authRoutes = require("./backend/routes/auth.routes");
app.use("/", authRoutes);

// ----------------------- production build -----------------------
// Express only serves static assets in production
if (IN_PROD) {
  app.use(express.static("frontend/build"));

  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// ----------------------- url not found -----------------------
app.get("/*", function (req, res) {
  res.json({ message: "404 Not found" });
});

// ----------------------- app listen -----------------------
app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

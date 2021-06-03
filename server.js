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
  host: "162.241.253.180",
  user: "ggdabhmy",
  password: process.env.DB_PASSWORD,
  database: "ggdabhmy_sampledb",
  connectionLimit: 5,
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server! - MOJO" });
});

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

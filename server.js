const path = require("path");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;
console.log("PORT=", process.env.PORT || "undefined");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server! - MOJO" });
});

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

const express = require("express");

const PORT = process.env.PORT || 3001;
console.log("PORT=", process.env.PORT || "undefined");

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`YOYOYO\! Server listening on ${PORT}`);
});

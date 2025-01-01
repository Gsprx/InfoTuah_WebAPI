// Node.js Server script
const uuid = require("uuid");
const path = require("path");
const express = require("express");

// include DAO file
const UserDAO = require("./public/scripts/DAO.js");
const { PassThrough } = require("stream");

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// init users
const userDAO = new UserDAO();

const usersList = [
  { username: "phlorion", password: "123" },
  { username: "gasp", password: "pp2p3" },
  { username: "warframer123", password: "warframer" },
];

usersList.forEach((user) => {
  userDAO.addUser(user);
});

// server
const PORT = 8080;
let server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

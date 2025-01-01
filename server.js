// Node.js Server script
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

// include DAO file
const UserDAO = require("./public/scripts/DAO.js");

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory

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

// login endpoint
app.post("/login", (req, res) => {
  // get the data
  const data = req.body;

  // try to authorize user
  const userAuth = userDAO.validateUser(data.username, data.password);

  // if user authorized create a uuid
  if (userAuth) {
    return res.status(200).json({
      success: true,
      message: "Login successful",
      sessionId: uuidv4(),
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }
});

// server
const PORT = 8080;
let server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

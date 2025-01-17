// Node.js Server script
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

// include DAO file
const UserDAO = require("./DAO.js");

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

let onlineUsersMap = {};

// login endpoint
app.post("/login", (req, res) => {
  // get the data
  const data = req.body;

  // try to authorize user
  const userAuth = userDAO.validateUser(data.username, data.password);

  // if user authorized and not already logged in create a uuid
  if (userAuth) {
    var sessionId = uuidv4();
    onlineUsersMap[data.username] = sessionId;
    console.log(onlineUsersMap);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      sessionId: sessionId,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }
});

// logout endpoint
app.post("/logout", (req, res) => {
  // get the data
  const data = req.body;

  // if this is an online user
  if (
    onlineUsersMap[data.username] &&
    onlineUsersMap[data.username] == data.sessionId
  ) {
    delete onlineUsersMap[data.username]; // remove him from the online users map
    console.log(onlineUsersMap);
  }

  // return response
  return res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
});

// add to cart endpoint
app.post("/addToCart", (req, res) => {
  const data = req.body;

  //validate user session
  if (
    onlineUsersMap[data.username] &&
    onlineUsersMap[data.username] === data.sessionId
  ) {
    const reply = userDAO.addCartItem(data.username, data.itemId);
    if (reply) {
      return res.status(200).json({
        success: true,
        message: "Item successfully added to cart!",
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "Item is already in your cart!",
      });
    }
  }
  return res.status(403).json({
    success: false,
    message: "Invalid session token.",
  });
});

//get cart endpoint
app.post("/getCart", (req, res) => {
  const data = req.body;
  //validate user session
  if (
    onlineUsersMap[data.username] &&
    onlineUsersMap[data.username] === data.sessionId
  ) {
    const items = userDAO.getCart(data.username);
    let cartItems_ = [];
    let totalCost_ = 0;
    for (item of items) {
      cartItems_.push({
        id: item.id,
        type: item.type,
        title: item.title,
        cost: item.cost,
      });
      totalCost_ += item.cost;
    }
    return res.status(200).json({
      success: true,
      cartItems: cartItems_,
      totalCost: totalCost_,
    });
  } else {
    return res.status(403).json({
      success: false,
      message: "Invalid session token.",
    });
  }
});

// server
const PORT = 8080;
let server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

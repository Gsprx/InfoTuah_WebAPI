// Node.js Server script
const uuid = require("uuid");
const path = require('path');
const express = require("express");

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8080;
let server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

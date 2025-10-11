// server.js
const express = require("express");
const app = express();
const PORT = 3000;

// Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing or incorrect",
    });
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];

  // Validate token
  if (token !== "mysecrettoken") {
    return res.status(403).json({
      message: "Invalid token",
    });
  }

  next(); // Token valid, proceed to route
};

// Public Route
app.get("/public", (req, res) => {
  res.status(200).send("This is a public route. No authentication required.");
});

// Protected Route
app.get("/protected", authenticateToken, (req, res) => {
  res
    .status(200)
    .send("You have accessed a protected route with a valid Bearer token!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret';
const PORT = process.env.PORT || 3000;

// Simple in-memory "account"
let balance = 1000;

// Hardcoded user (for exercise only)
const USER = {
  username: 'user1',
  password: 'password123'
};

// Utility to validate amount
function parseAmount(body) {
  if (body === undefined) return null;
  const amount = Number(body);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return amount;
}

// LOGIN: returns JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  if (username === USER.username && password === USER.password) {
    // you can include any claims you need (avoid sensitive info in token)
    const payload = { username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware: verify Bearer token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({ message: 'Token missing or malformed' });
  }
  const token = parts[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // e.g., { username: 'user1', iat:..., exp:... }
    next();
  });
}

// Protected: Get balance
app.get('/balance', verifyToken, (req, res) => {
  return res.json({ balance });
});

// Protected: Deposit
app.post('/deposit', verifyToken, (req, res) => {
  const amount = parseAmount(req.body && req.body.amount);
  if (amount === null) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  balance += amount;
  return res.json({ message: `Deposited $${amount}`, newBalance: balance });
});

// Protected: Withdraw
app.post('/withdraw', verifyToken, (req, res) => {
  const amount = parseAmount(req.body && req.body.amount);
  if (amount === null) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  if (amount > balance) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }
  balance -= amount;
  return res.json({ message: `Withdrew $${amount}`, newBalance: balance });
});

// Default error handler for JSON parse errors, etc.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

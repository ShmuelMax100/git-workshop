/**
 * index.js — tiny Express API that exposes the calculator over HTTP.
 *
 * Endpoints:
 *   POST /add      { a, b } → { result }
 *   POST /subtract { a, b } → { result }
 *   POST /multiply { a, b } → { result }
 *   POST /divide   { a, b } → { result }
 *   GET  /health          → { status: "ok" }
 */

const express = require('express');
const { add, subtract, multiply, divide } = require('./calculator');

const app = express();
app.use(express.json());

// ── Health check (used by CI to verify the server starts) ──────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: process.env.npm_package_version || '1.0.0' });
});

// ── Calculator endpoints ───────────────────────────────────────────────────
app.post('/add', (req, res) => {
  const { a, b } = req.body;
  res.json({ result: add(Number(a), Number(b)) });
});

app.post('/subtract', (req, res) => {
  const { a, b } = req.body;
  res.json({ result: subtract(Number(a), Number(b)) });
});

app.post('/multiply', (req, res) => {
  const { a, b } = req.body;
  res.json({ result: multiply(Number(a), Number(b)) });
});

app.post('/divide', (req, res) => {
  const { a, b } = req.body;
  try {
    res.json({ result: divide(Number(a), Number(b)) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Start only when run directly (not when imported in tests) ──────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Calculator API running on port ${PORT}`));
}

module.exports = app;

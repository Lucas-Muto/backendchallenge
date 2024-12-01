const express = require("express");
const routes = require("./routes");

const app = express();

// Middleware
app.use(express.json());

// Mount routes - notice we're using /api prefix
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app; 
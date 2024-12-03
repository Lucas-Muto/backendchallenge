const express = require("express");
const routes = require("./routes");

const app = express();

// Middleware
app.use(express.json());

// Monta as rotas 
app.use('/api', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app; 
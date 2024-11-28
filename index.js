const express = require("express");
const app = express();


// Rotas
const travelerRoutes = require("./routes/travelerRoutes");
const infractionRoutes = require("./routes/infractionRoutes");

// Middleware para JSON
app.use(express.json());

// Definição das rotas
app.use("/travelers", travelerRoutes);
app.use("/infractions", infractionRoutes);

// Se o arquivo não for usado em testes, inicie o servidor
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));
}

module.exports = app;

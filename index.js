const app = require('./app');


if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));
  }
  
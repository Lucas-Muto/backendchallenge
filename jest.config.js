module.exports = {
    rootDir: ".", // Define a raiz do projeto
    testEnvironment: "node", // Configura o ambiente de execução para Node.js
    moduleDirectories: ["node_modules", "<rootDir>"], // Permite encontrar módulos no diretório raiz
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    testPathIgnorePatterns: ["/node_modules/"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    }
};
  
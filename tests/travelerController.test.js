const request = require("supertest");
const app = require("../index"); // Importar o servidor principal da aplicação
const database = require("../database");

// Configurar o relógio para testes consistentes
beforeAll(() => {
  jest.useFakeTimers("modern");
  jest.setSystemTime(new Date("2024-11-28T00:00:00Z")); // Congela o tempo na data especificada
});

afterAll(() => {
  jest.useRealTimers(); // Retorna o relógio ao comportamento normal após os testes
});

// Limpar o banco de dados antes de cada teste
beforeEach(() => {
  database.travelers = [];
  database.infractions = [];
});

// Testar para cadastrar um viajante
describe("POST /travelers", () => {
  it("Deve criar um novo viajante com sucesso", async () => {
    const response = await request(app).post("/travelers").send({
      name: "Lucas Moura",
      birthDate: "1990-01-01",
      passportNumber: "12345"
    });

    expect(response.status).toBe(201); // Status HTTP esperado: 201
    expect(response.body.newTraveler).toEqual({
      name: "Lucas Moura",
      birthDate: "1990-01-01",
      passportNumber: "12345"
    });
    expect(database.travelers.length).toBe(1); // Verificar se foi salvo
  });

  it("Deve retornar erro se faltar campos obrigatórios", async () => {
    const response = await request(app).post("/travelers").send({
      name: "Lucas Moura",
    });

    expect(response.status).toBe(400); // Status HTTP esperado: 400
    expect(response.body.error).toBe("Todos os campos são necessários."); // Corrigido
  });
});

// Testar a busca de viajantes
describe("GET /travelers/:passportNumber", () => {
  it("Deve retornar os detalhes de um viajante existente", async () => {
    // Preencher o banco de dados com um viajante
    database.travelers.push({
      name: "Pedro Silva",
      birthDate: "1985-02-15",
      passportNumber: "54321"
    });

    const response = await request(app).get("/travelers/54321");

    expect(response.status).toBe(200); // Status HTTP esperado: 200
    expect(response.body).toEqual({
      name: "Pedro Silva",
      birthDate: "1985-02-15",
      passportNumber: "54321"
    });
  });

  it("Deve retornar erro se o viajante não for encontrado", async () => {
    const response = await request(app).get("/travelers/99999");

    expect(response.status).toBe(404); // Status HTTP esperado: 404
    expect(response.body.error).toBe("Viajante não encontrado.");
  });
});

// Testar a validação de viagens
describe("POST /travelers/:passportNumber/validate", () => {
  it("Deve permitir viagem se todas as regras forem atendidas", async () => {
    database.travelers.push({
      name: "Alice",
      birthDate: "2000-01-01",
      passportNumber: "11111"
    });

    database.infractions.push({
      description: "Teste de infração",
      passportNumber: "11111",
      dateTime: "2023-05-01T10:00:00Z",
      severity: "Baixa"
    });

    const response = await request(app).post("/travelers/11111/validate").send({
      startDate: "2024-06-01",
      endDate: "2024-06-10"
    });

    expect(response.status).toBe(200); // Status HTTP esperado: 200
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear viagem se o viajante tiver mais de 12 pontos", async () => {
    database.travelers.push({
      name: "Bob",
      birthDate: "1990-01-01",
      passportNumber: "22222"
    });

    database.infractions.push({
      description: "Infração grave",
      passportNumber: "22222",
      dateTime: "2023-05-01T10:00:00Z",
      severity: "Gravíssima"
    });

    const response = await request(app).post("/travelers/22222/validate").send({
      startDate: "2024-06-01",
      endDate: "2024-06-10"
    });

    expect(response.status).toBe(400); // Status HTTP esperado: 400
    expect(response.body.error).toBe("O viajante tem mais de 12 pontos nos últimos 12 meses.");
  });

  it("Deve bloquear viagem se o viajante tiver infrações próximas ao período de viagem", async () => {
    database.travelers.push({
      name: "Carlos",
      birthDate: "1980-01-01",
      passportNumber: "33333"
    });

    database.infractions.push({
      description: "Infração leve",
      passportNumber: "33333",
      dateTime: "2024-05-01T10:00:00Z",
      severity: "Baixa"
    });

    const response = await request(app).post("/travelers/33333/validate").send({
      startDate: "2024-06-01",
      endDate: "2024-06-10"
    });

    expect(response.status).toBe(400); // Status HTTP esperado: 400
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });

  it("Deve retornar erro se as datas fornecidas forem inválidas", async () => {
    database.travelers.push({
      name: "Daniel",
      birthDate: "1995-01-01",
      passportNumber: "44444"
    });

    const response = await request(app).post("/travelers/44444/validate").send({
      startDate: "data-invalida",
      endDate: "2024-06-10"
    });

    expect(response.status).toBe(400); // Status HTTP esperado: 400
    expect(response.body.error).toBe("As datas fornecidas são inválidas.");
  });
});

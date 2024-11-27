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
      passportNumber: "12345",
    });

    expect(response.status).toBe(201); // Status HTTP esperado: 201
    expect(response.body.newTraveler).toEqual({
      name: "Lucas Moura",
      birthDate: "1990-01-01",
      passportNumber: "12345",
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
    database.travelers.push({
      name: "Pedro Silva",
      birthDate: "1985-02-15",
      passportNumber: "54321",
    });

    const response = await request(app).get("/travelers/54321");

    expect(response.status).toBe(200); // Status HTTP esperado: 200
    expect(response.body).toEqual({
      name: "Pedro Silva",
      birthDate: "1985-02-15",
      passportNumber: "54321",
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
  it("Deve permitir que Daniel viaje um dia após o nascimento", async () => {
    database.travelers.push({
      name: "Daniel",
      birthDate: "1995-01-01",
      passportNumber: "44444",
    });

    database.infractions.push(
      { description: "Infração leve", passportNumber: "44444", dateTime: "2000-01-01T00:00:00Z", severity: "Baixa" },
      { description: "Infração leve", passportNumber: "44444", dateTime: "2000-06-01T00:00:00Z", severity: "Baixa" }
    );

    const response = await request(app).post("/travelers/44444/validate").send({
      startDate: "1995-01-02",
      endDate: "1995-01-02",
    });

    expect(response.status).toBe(200); // Permite a viagem
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear Carlos ao tentar viajar antes do nascimento", async () => {
    database.travelers.push({
      name: "Carlos",
      birthDate: "1980-01-01",
      passportNumber: "33333",
    });

    const response = await request(app).post("/travelers/33333/validate").send({
      startDate: "1979-05-06",
      endDate: "1979-05-06",
    });

    expect(response.status).toBe(400); // Bloqueio esperado
    expect(response.body.error).toBe("Não pode viajar antes da data de nascimento.");
  });

  it("Deve bloquear Bob devido a infrações um ano antes ou depois do período de viagem", async () => {
    database.travelers.push({
      name: "Bob",
      birthDate: "1990-01-01",
      passportNumber: "22222",
    });

    database.infractions.push(
      { description: "Infração grave", passportNumber: "22222", dateTime: "1997-01-02T00:00:00Z", severity: "Grave" },
      { description: "Infração leve", passportNumber: "22222", dateTime: "1999-01-02T00:00:00Z", severity: "Baixa" }
    );

    const response = await request(app).post("/travelers/22222/validate").send({
      startDate: "1998-01-01",
      endDate: "1998-01-03",
    });

    expect(response.status).toBe(400); // Bloqueio esperado
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });
});

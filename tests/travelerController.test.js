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
    const response = await request(app).get("/travelers/54321");

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

  it("Deve permitir que Hugo viaje um dia após seu nascimento", async () => {
    database.travelers.push({
      name: "Hugo",
      birthDate: "2000-07-05",
      passportNumber: "66666",
    });

    database.infractions.push(
      { description: "Infração leve", passportNumber: "66666", dateTime: "2003-02-22T00:00:00Z", severity: "Baixa" },
      { description: "Infração grave", passportNumber: "66666", dateTime: "2022-05-27T00:00:00Z", severity: "Grave" }
    );

    const response = await request(app).post("/travelers/66666/validate").send({
      startDate: "2000-07-06",
      endDate: "2001-07-06",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear Vigor devido a infrações nos últimos 12 meses", async () => {
    database.travelers.push({
      name: "Vigor",
      birthDate: "2001-02-01",
      passportNumber: "77777",
    });

    database.infractions.push(
      { description: "Infração grave", passportNumber: "77777", dateTime: "2024-04-06T00:00:00Z", severity: "Grave" },
      { description: "Infração média", passportNumber: "77777", dateTime: "2023-12-30T00:00:00Z", severity: "Média" }
    );

    const response = await request(app).post("/travelers/77777/validate").send({
      startDate: "2024-11-28",
      endDate: "2027-12-05",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });

  it("Deve bloquear João devido a tentativa de viagem após infração", async () => {
    database.travelers.push({
      name: "João",
      birthDate: "2000-04-08",
      passportNumber: "99999",
    });

    database.infractions.push(
      { description: "Infração grave", passportNumber: "99999", dateTime: "1995-01-02T00:00:00Z", severity: "Grave" },
      { description: "Infração leve", passportNumber: "99999", dateTime: "2023-04-20T00:00:00Z", severity: "Baixa" }
    );

    const response = await request(app).post("/travelers/99999/validate").send({
      startDate: "2001-01-01",
      endDate: "1996-01-01",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });

  it("Deve bloquear Vitor devido a tentativa de viagem antes de infração", async () => {
    database.travelers.push({
      name: "Vitor",
      birthDate: "2001-09-02",
      passportNumber: "98733",
    });

    database.infractions.push(
      { description: "Infração grave", passportNumber: "98733", dateTime: "1994-01-02T00:00:00Z", severity: "Grave" },
      { description: "Infração leve", passportNumber: "98733", dateTime: "2021-04-20T00:00:00Z", severity: "Baixa" }
    );

    const response = await request(app).post("/travelers/98733/validate").send({
      startDate: "2003-02-05",
      endDate: "1993-01-01",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });

  it("Deve permitir que Kabib viaje com exatamente 12 pontos de infrações", async () => {
    database.travelers.push({
      name: "Kabib",
      birthDate: "1973-09-05",
      passportNumber: "90909",
    });

    database.infractions.push(
      { description: "Infração grave", passportNumber: "90909", dateTime: "2024-06-06T00:00:00Z", severity: "Grave" },
      { description: "Infração média", passportNumber: "90909", dateTime: "2023-12-30T00:00:00Z", severity: "Média" }
    );

    const response = await request(app).post("/travelers/90909/validate").send({
      startDate: "2024-11-28",
      endDate: "2032-11-07",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear Jesus devido a ter mais de 12 pontos em infrações", async () => {
    database.travelers.push({
      name: "Jesus",
      birthDate: "1976-08-06",
      passportNumber: "80808",
    });

    database.infractions.push(
      { description: "Infração gravíssima", passportNumber: "80808", dateTime: "2024-04-04T00:00:00Z", severity: "Gravíssima" },
      { description: "Infração leve", passportNumber: "80808", dateTime: "2024-02-01T00:00:00Z", severity: "Baixa" }
    );

    const response = await request(app).post("/travelers/80808/validate").send({
      startDate: "2024-11-28",
      endDate: "2050-07-11",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante possui 15 pontos acumulados nos últimos 12 meses. O limite é 12 pontos.");
  });
});

// Verifica se uma data de infração conflita com um intervalo de viagem
const conflictsWithPeriod = (infractionDate, startDate, endDate) => {
  const infractionDateTime = new Date(infractionDate);
  const travelStartDate = new Date(startDate);
  const travelEndDate = new Date(endDate);

  // Calcular os limites (1 ano antes do início e 1 ano depois do fim)
  const oneYearBeforeStart = new Date(travelStartDate);
  oneYearBeforeStart.setFullYear(travelStartDate.getFullYear() - 1);
  
  const oneYearAfterEnd = new Date(travelEndDate);
  oneYearAfterEnd.setFullYear(travelEndDate.getFullYear() + 1);

  // Verificar se a data da infração está dentro do período restrito
  return infractionDateTime >= oneYearBeforeStart && 
         infractionDateTime <= oneYearAfterEnd;
};

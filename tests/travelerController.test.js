const request = require("supertest");
const app = require("../index");
const prisma = require("../prisma/client");

// Keep the timer setup
beforeAll(() => {
  jest.useFakeTimers("modern");
});

afterAll(() => {
  jest.useRealTimers();
});

// Update database cleanup to use Prisma
beforeEach(async () => {
  await prisma.infraction.deleteMany();
  await prisma.traveler.deleteMany();
});

// Update test cases to use Prisma
describe("POST /travelers", () => {
  it("Deve criar um novo viajante com sucesso", async () => {
    const response = await request(app).post("/travelers").send({
      name: "Lucas Moura",
      birthDate: "1990-01-01",
      passportNumber: "12345",
    });

    expect(response.status).toBe(201);
    expect(response.body.traveler).toMatchObject({
      name: "Lucas Moura",
      passportNumber: "12345",
    });

    // Verify in database
    const savedTraveler = await prisma.traveler.findUnique({
      where: { passportNumber: "12345" }
    });
    expect(savedTraveler).toBeTruthy();
  });

  it("Deve retornar erro se faltar campos obrigatórios", async () => {
    const response = await request(app).post("/travelers").send({
      name: "Lucas Moura",
    });

    expect(response.status).toBe(400); // Status HTTP esperado: 400
    expect(response.body.error).toBe("Todos os campos são necessários."); // Corrigido
  });
});

describe("GET /travelers/:passportNumber", () => {
  it("Deve retornar os detalhes de um viajante existente", async () => {
    // Create test data using Prisma
    await prisma.traveler.create({
      data: {
        name: "Pedro Silva",
        birthDate: new Date("1985-02-15"),
        passportNumber: "54321",
      }
    });

    const response = await request(app).get("/travelers/54321");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Pedro Silva",
      passportNumber: "54321",
    });
  });

  it("Deve retornar erro se o viajante não for encontrado", async () => {
    const response = await request(app).get("/travelers/54321");

    expect(response.status).toBe(404); // Status HTTP esperado: 404
    expect(response.body.error).toBe("Viajante não encontrado.");
  });
});

describe("POST /travelers/:passportNumber/validate", () => {
  it("Deve permitir que Hugo viaje pro passado um dia após o seu nascimento", async () => {
    // Create traveler
    await prisma.traveler.create({
      data: {
        name: "Hugo",
        birthDate: new Date("2000-07-05"),
        passportNumber: "66666",
      }
    });

    // Create infractions
    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração leve",
          passportNumber: "66666",
          dateTime: new Date("2003-02-22T00:00:00Z"),
          severity: "Baixa"
        },
        {
          description: "Infração grave",
          passportNumber: "66666",
          dateTime: new Date("2022-05-27T00:00:00Z"),
          severity: "Grave"
        }
      ]
    });

    jest.setSystemTime(new Date("2035-07-06T00:00:00Z"));

    const response = await request(app).post("/travelers/66666/validate").send({
      endDate: "2000-07-06",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear Carlos ao tentar viajar para antes do seu nascimento", async () => {
    await prisma.traveler.create({
      data: {
        name: "Carlos",
        birthDate: new Date("1980-01-01"),
        passportNumber: "33333",
      }
    });

    jest.setSystemTime(new Date("1999-05-06T00:00:00Z")); 

    const response = await request(app).post("/travelers/33333/validate").send({
      endDate: "1979-05-06",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Não pode viajar antes da data de nascimento.");
  });

  it("Deve permitir que Vigor viaje com exatamente 12 pontos de infrações", async () => {
    await prisma.traveler.create({
      data: {
        name: "Vigor",
        birthDate: new Date("2001-02-01"),
        passportNumber: "77777",
      }
    });

    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração grave",
          passportNumber: "77777",
          dateTime: new Date("2024-04-06T00:00:00Z"),
          severity: "Grave"
        },
        {
          description: "Infração média",
          passportNumber: "77777",
          dateTime: new Date("2023-12-30T00:00:00Z"),
          severity: "Média"
        }
      ]
    });

    jest.setSystemTime(new Date("2024-11-28T00:00:00Z")); 

    const response = await request(app).post("/travelers/77777/validate").send({
      endDate: "2027-12-05",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear João devido a tentativa de viajar para um ano depois de uma infração que recebeu", async () => {
    await prisma.traveler.create({
      data: {
        name: "João",
        birthDate: new Date("1990-04-08"),
        passportNumber: "99999",
      }
    });

    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração grave",
          passportNumber: "99999",
          dateTime: new Date("1995-01-02T00:00:00Z"),
          severity: "Grave"
        },
        {
          description: "Infração leve",
          passportNumber: "99999",
          dateTime: new Date("2023-04-20T00:00:00Z"),
          severity: "Baixa"
        }
      ]
    });

    jest.setSystemTime(new Date("2001-01-01T00:00:00Z")); 

    const response = await request(app).post("/travelers/99999/validate").send({
      endDate: "1996-01-01",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });

  it("Deve bloquear Vitor devido a tentativa de viajar para um ano antes de uma infração que recebeu", async () => {
    await prisma.traveler.create({
      data: {
        name: "Vitor",
        birthDate: new Date("2001-09-02"),
        passportNumber: "98733",
      }
    });

    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração grave",
          passportNumber: "98733",
          dateTime: new Date("2027-01-02T00:00:00Z"),
          severity: "Grave"
        },
        {
          description: "Infração leve",
          passportNumber: "98733",
          dateTime: new Date("2021-04-20T00:00:00Z"),
          severity: "Baixa"
        }
      ]
    });

    jest.setSystemTime(new Date("2003-02-05T00:00:00Z")); 

    const response = await request(app).post("/travelers/98733/validate").send({
      endDate: "2026-01-02",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
  });

  it("Deve permitir que Kabib viaje com exatamente 12 pontos de infrações nos últimos 12 meses", async () => {
    await prisma.traveler.create({
      data: {
        name: "Kabib",
        birthDate: new Date("1973-09-05"),
        passportNumber: "90909",
      }
    });

    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração grave",
          passportNumber: "90909",
          dateTime: new Date("2024-06-06T00:00:00Z"),
          severity: "Grave"
        },
        {
          description: "Infração média",
          passportNumber: "90909",
          dateTime: new Date("2023-12-30T00:00:00Z"),
          severity: "Média"
        }
      ]
    });

    jest.setSystemTime(new Date("2024-11-28T00:00:00Z")); 

    const response = await request(app).post("/travelers/90909/validate").send({
      endDate: "2032-11-07",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O viajante pode viajar.");
  });

  it("Deve bloquear Jesus devido a ter mais de 12 pontos em infrações nos últimos 12 meses", async () => {
    await prisma.traveler.create({
      data: {
        name: "Jesus",
        birthDate: new Date("1976-08-06"),
        passportNumber: "80808",
      }
    });

    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração gravíssima",
          passportNumber: "80808",
          dateTime: new Date("2024-04-04T00:00:00Z"),
          severity: "Gravíssima"
        },
        {
          description: "Infração leve",
          passportNumber: "80808",
          dateTime: new Date("2024-02-01T00:00:00Z"),
          severity: "Baixa"
        }
      ]
    });

    jest.setSystemTime(new Date("2024-11-28T00:00:00Z")); 

    const response = await request(app).post("/travelers/80808/validate").send({
      endDate: "2050-07-11",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O viajante possui 15 pontos acumulados nos últimos 12 meses. O limite é 12 pontos.");
  });

  it("Deve permitir Yoda devido ter infrações muito no passado e apenas uma recente", async () => {
    await prisma.traveler.create({
      data: {
        name: "Yoda",
        birthDate: new Date("1972-05-03"),
        passportNumber: "50305",
      }
    });

    await prisma.infraction.createMany({
      data: [
        {
          description: "Infração gravíssima",
          passportNumber: "50305",
          dateTime: new Date("1987-03-03T00:00:00Z"),
          severity: "Gravíssima"
        },
        {
          description: "Infração grave",
          passportNumber: "50305",
          dateTime: new Date("2010-01-03T00:00:00Z"),
          severity: "Grave"
        },
        {
          description: "Infração leve",
          passportNumber: "50305",
          dateTime: new Date("2024-03-02T00:00:00Z"),
          severity: "Baixa"
        }
      ]
    });

    jest.setSystemTime(new Date("2024-11-28T00:00:00Z")); 

    const response = await request(app).post("/travelers/50305/validate").send({
      endDate: "2050-07-11",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("O viajante pode viajar.");
  });
});




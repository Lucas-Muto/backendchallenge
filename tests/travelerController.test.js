const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/client");

// Global test setup
beforeAll(() => {
  jest.useFakeTimers('modern');
});

afterAll(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Traveler Controller Tests", () => {
  let authToken;

  beforeEach(async () => {
    // Login pra pegar a auth token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@inspector.com",
        password: "123456"
      });
    
    authToken = loginResponse.body.token;
  });

  describe("POST /api/travelers", () => {
    it("Deve criar um novo viajante com sucesso", async () => {
      const mockTraveler = {
        id: 1,
        name: "Lucas Moura",
        birthDate: new Date("1990-01-01"),
        passportNumber: "12345",
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.traveler.create.mockResolvedValue(mockTraveler);
      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);

      const response = await request(app)
        .post("/api/travelers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Lucas Moura",
          birthDate: "1990-01-01",
          passportNumber: "12345",
        });

      expect(response.status).toBe(201);
      expect(response.body.traveler).toMatchObject({
        name: "Lucas Moura",
        passportNumber: "12345",
      });
    });

    it("Deve retornar erro se faltar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/travelers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Lucas Moura",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Todos os campos são necessários.");
    });

    it("Não deve permitir criar um viajante com número de passaporte duplicado", async () => {
      const mockTraveler = {
        id: 1,
        name: "Lucas Moura",
        birthDate: new Date("1990-01-01"),
        passportNumber: "12345",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    
      // Primeira tentativa - criação bem sucedida
      prisma.traveler.create.mockResolvedValueOnce(mockTraveler);
      
      // Segunda tentativa - simulação de erro de constraint única do Prisma
      prisma.traveler.create.mockRejectedValueOnce({
        code: 'P2002',
        message: 'Unique constraint violation'
      });
    
      // Primeira criação - deve funcionar
      const firstResponse = await request(app)
        .post("/api/travelers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Lucas Moura",
          birthDate: "1990-01-01",
          passportNumber: "12345",
        });
    
      expect(firstResponse.status).toBe(201);
    
      // Segunda tentativa com o mesmo número de passaporte - deve falhar
      const secondResponse = await request(app)
        .post("/api/travelers")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Another Name",
          birthDate: "1995-01-01",
          passportNumber: "12345",
        });
    
      expect(secondResponse.status).toBe(400);
      expect(secondResponse.body.error).toBe("Já existe um viajante com este número de passaporte.");
    });
  });

  describe("GET /api/travelers/:passportNumber", () => {
    it("Deve retornar os detalhes de um viajante existente", async () => {
      const mockTraveler = {
        name: "Pedro Silva",
        birthDate: new Date("1985-02-15"),
        passportNumber: "54321",
      };

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);

      const response = await request(app)
        .get("/api/travelers/54321")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: "Pedro Silva",
        passportNumber: "54321",
      });
    });

    it("Deve retornar erro se o viajante não for encontrado", async () => {
      prisma.traveler.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/travelers/54321")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Viajante não encontrado.");
    });
  });

  describe("POST /api/travelers/:passportNumber/validate", () => {
    it("Deve permitir que Hugo viaje pro passado um dia após o seu nascimento", async () => {
      const mockTraveler = {
        name: "Hugo",
        birthDate: new Date("2000-07-05"),
        passportNumber: "66666",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);

      jest.setSystemTime(new Date("2035-07-06T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/66666/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "2000-07-06",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("O viajante pode viajar.");
    });

    it("Deve permitir que Vigor viaje com exatamente 12 pontos de infrações", async () => {
      const mockTraveler = {
        name: "Vigor",
        birthDate: new Date("2001-02-01"),
        passportNumber: "77777",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);


      jest.setSystemTime(new Date("2024-11-28T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/77777/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "2027-12-05",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("O viajante pode viajar.");
    });

    it("Deve bloquear Carlos ao tentar viajar para antes do seu nascimento", async () => {
      const mockTraveler = {
        name: "Carlos",
        birthDate: new Date("1980-01-01"),
        passportNumber: "33333",
      };

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue([]);

      jest.setSystemTime(new Date("1999-05-06T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/33333/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "1979-05-06",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Não pode viajar antes da data de nascimento.");
    });

    it("Deve bloquear João devido a tentativa de viajar para um ano depois de uma infração que recebeu", async () => {
      const mockTraveler = {
        name: "João",
        birthDate: new Date("1990-04-08"),
        passportNumber: "99999",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);

      jest.setSystemTime(new Date("2001-01-01T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/99999/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "1996-01-01",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
    });

    it("Deve bloquear Vitor devido a tentativa de viajar para um ano antes de uma infração que recebeu", async () => {
      const mockTraveler = {
        name: "Vitor",
        birthDate: new Date("2001-09-02"),
        passportNumber: "98733",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);

      jest.setSystemTime(new Date("2003-02-05T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/98733/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "2026-01-02",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("O viajante tem infrações perto do período de viagem.");
    });

    it("Deve permitir que Kabib viaje com exatamente 12 pontos de infrações nos últimos 12 meses", async () => {
      const mockTraveler = {
        name: "Kabib",
        birthDate: new Date("1973-09-05"),
        passportNumber: "90909",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);

      jest.setSystemTime(new Date("2024-11-28T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/90909/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "2032-11-07",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("O viajante pode viajar.");
    });

    it("Deve bloquear Jesus devido a ter mais de 12 pontos em infrações nos últimos 12 meses", async () => {
      const mockTraveler = {
        name: "Jesus",
        birthDate: new Date("1976-08-06"),
        passportNumber: "80808",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);



      jest.setSystemTime(new Date("2024-11-28T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/80808/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "2050-07-11",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("O viajante possui 15 pontos acumulados nos últimos 12 meses. O limite é 12 pontos.");
    });

    it("Deve permitir Yoda devido ter infrações muito no passado e apenas uma recente", async () => {
      const mockTraveler = {
        name: "Yoda",
        birthDate: new Date("1972-05-03"),
        passportNumber: "50305",
      };

      const mockInfractions = [
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
      ];

      prisma.traveler.findUnique.mockResolvedValue(mockTraveler);
      prisma.infraction.findMany.mockResolvedValue(mockInfractions);

      jest.setSystemTime(new Date("2024-11-28T00:00:00Z"));

      const response = await request(app)
        .post("/api/travelers/50305/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          endDate: "2050-07-11",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("O viajante pode viajar.");
    });
  });
});




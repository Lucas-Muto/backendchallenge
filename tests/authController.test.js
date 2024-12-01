const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/client");

describe("Testes do Controlador de Autenticação", () => {
  beforeEach(() => {
    // Resetar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it("Deve registrar um novo fiscal", async () => {
    const mockInspector = {
      id: 1,
      name: "Novo Fiscal",
      email: "novo@fiscal.com",
      badge: "NOVO123"
    };

    prisma.inspector.create.mockResolvedValue(mockInspector);

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Novo Fiscal",
        email: "novo@fiscal.com",
        password: "123456",
        badge: "NOVO123"
      });

    expect(response.status).toBe(201);
    expect(response.body.inspector).toHaveProperty("badge", "NOVO123");
  });

  it("Deve realizar login com sucesso", async () => {
    const mockInspector = {
      id: 1,
      email: "teste@fiscal.com",
      password: "hashedPassword123",
      badge: "TESTE123"
    };

    prisma.inspector.findUnique.mockResolvedValue(mockInspector);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "teste@fiscal.com",
        password: "123456"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
}); 
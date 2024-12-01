
const mockedPrisma = {
  traveler: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  infraction: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  inspector: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn()
  }
};


jest.mock('../prisma/client', () => mockedPrisma);


// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token_123'),
  verify: jest.fn().mockReturnValue({ id: 1, badge: 'TEST123' })
}));

// Adicionar JWT_SECRET no process.env
process.env.JWT_SECRET = 'test_secret';

module.exports = {
  mockedPrisma
};
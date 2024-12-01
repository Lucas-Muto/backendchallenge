const { mockDeep, mockReset } = require('jest-mock-extended');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const dateUtils = {
  isWithinLast12Months: jest.fn(),
  conflictsWithPeriod: jest.fn()
};

jest.mock('../prisma/client', () => mockedPrisma);
jest.mock('../utils/dateUtils', () => dateUtils);

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

// Add JWT_SECRET to process.env
process.env.JWT_SECRET = 'test_secret';

module.exports = {
  mockedPrisma,
  dateUtils
};
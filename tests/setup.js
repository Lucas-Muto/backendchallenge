const { mockDeep, mockReset } = require('jest-mock-extended');

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
};

const dateUtils = {
  isWithinLast12Months: jest.fn(),
  conflictsWithPeriod: jest.fn()
};

jest.mock('../prisma/client', () => mockedPrisma);
jest.mock('../utils/dateUtils', () => dateUtils);

module.exports = {
  mockedPrisma,
  dateUtils
};
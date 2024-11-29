const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { v4: uuid } = require('uuid');
const path = require('path');

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

const testUrl = process.env.DATABASE_URL;

beforeAll(async () => {
  // Generate unique schema for concurrent test runs
  const schema = `test_${uuid()}`;
  
  // Update DATABASE_URL with new schema
  process.env.DATABASE_URL = `${testUrl}?schema=${schema}`;

  // Create database schema and run migrations
  execSync(`"${prismaBinary}" db push --skip-generate`, {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });

  jest.useFakeTimers("modern");
});

beforeEach(async () => {
  // Clean database before each test
  const prisma = new PrismaClient();
  const tables = ['Infraction', 'Traveler'];
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
  
  await prisma.$disconnect();
});

afterAll(async () => {
  // Clean up and disconnect
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  jest.useRealTimers();
});
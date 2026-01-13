import request from 'supertest';
import app from '../src/index';
import prisma from '../src/utils/prisma';
import { generateToken } from '../src/utils/jwt';

describe('Client Routes', () => {
  let authToken: string;
  let testClientId: string;

  beforeAll(async () => {
    // Create test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'clienttest@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      },
    });

    authToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  });

  afterAll(async () => {
    await prisma.client.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Client',
          email: 'client@test.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Client');
      testClientId = response.body.id;
    });

    it('should require authentication', async () => {
      const response = await request(app).post('/api/clients').send({
        name: 'Test Client',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/clients', () => {
    it('should get all clients', async () => {
      const response = await request(app)
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should get a client by id', async () => {
      const response = await request(app)
        .get(`/api/clients/${testClientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testClientId);
    });
  });
});

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { User } from '../src/features/users/user.model';
import { connectDB, disconnectDB } from '../src/config/db';

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/usermgmt-test';

beforeAll(async () => {
  await connectDB(TEST_MONGO_URI);
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'invalid-email' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password' });

      expect(res.status).toBe(401);
    });
  });
});

describe('Users API', () => {
  let adminToken: string;
  let userToken: string;
  let adminUser: any;
  let regularUser: any;

  beforeEach(async () => {
    await User.deleteMany({});

    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@test.com', password: 'Admin@123', role: 'admin' });

    const userRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User', email: 'user@test.com', password: 'User@123', role: 'user' });

    adminToken = adminRes.body.data.accessToken;
    userToken = userRes.body.data.accessToken;
    adminUser = adminRes.body.data.user;
    regularUser = userRes.body.data.user;
  });

  describe('GET /api/users', () => {
    it('should allow admin to fetch users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.users)).toBe(true);
    });

    it('should deny regular user', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/users');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('should allow admin to create user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New User', email: 'new@test.com', password: 'New@123', role: 'user' });

      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe('new@test.com');
    });

    it('should deny manager from creating user', async () => {
      const managerRes = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Manager', email: 'manager@test.com', password: 'Manager@123', role: 'manager' });

      const managerToken = managerRes.body.data.accessToken;

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'New User', email: 'new2@test.com', password: 'New@123', role: 'user' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/me', () => {
    it('should get own profile', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('user@test.com');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update own profile', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.user.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow admin to deactivate user', async () => {
      const res = await request(app)
        .delete(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const userCheck = await User.findById(regularUser._id);
      expect(userCheck?.status).toBe('inactive');
    });

    it('should deny regular user from deleting', async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should validate MongoDB ObjectId', async () => {
      const res = await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
    });
  });
});

describe('Health Check', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
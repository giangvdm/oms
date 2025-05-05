import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRoutes from '../routes/user.route.js';
import User from '../models/user.model.js';

describe('User API Endpoints', () => {
  let app;
  let mongoServer;
  let testUserId;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Set up Express app
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);

    // Set JWT secret for testing
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all users before each test
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    test('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe(userData.name);
      expect(res.body.data.email).toBe(userData.email);
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });

    test('should not create user with existing email', async () => {
      // Create a user first
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        passwordHash: await bcrypt.hash('password123', 10)
      });

      // Try to create another user with the same email
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should validate required fields', async () => {
      const userData = {
        // Missing name and password
        email: 'test@example.com'
      };

      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10)
      });
      await user.save();
      testUserId = user._id;
    });

    test('should login user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(loginData.email);
    });

    test('should not login with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(res.statusCode).toBe(400);
      expect(res.body).not.toHaveProperty('token');
    });

    test('should not login non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(res.statusCode).toBe(400);
      expect(res.body).not.toHaveProperty('token');
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      // Create test users
      await User.create([
        {
          name: 'User 1',
          email: 'user1@example.com',
          passwordHash: await bcrypt.hash('password123', 10)
        },
        {
          name: 'User 2',
          email: 'user2@example.com',
          passwordHash: await bcrypt.hash('password123', 10)
        }
      ]);
    });

    test('should get all users', async () => {
      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('PUT /api/users/:id', () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10)
      });
      await user.save();
      testUserId = user._id;
    });

    test('should update user details', async () => {
      const updateData = {
        name: 'Updated User Name'
      };

      const res = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updateData.name);
    });

    test('should return 404 for invalid user ID', async () => {
      const invalidId = '60c72b2f5e7f894e3cdb1234';
      const updateData = {
        name: 'Updated User Name'
      };

      const res = await request(app)
        .put(`/api/users/${invalidId}`)
        .send(updateData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import searchRoutes from '../routes/search.route.js';
import Search from '../models/search.model.js';
import User from '../models/user.model.js';
import { protect } from '../middleware/auth.middleware.js';

// Mock external API calls
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      access_token: 'mock-token',
      expires_in: 3600
    }
  })),
  get: jest.fn((url) => {
    if (url.includes('/images/')) {
      return Promise.resolve({
        data: {
          results: [
            {
              id: 'test-image-1',
              title: 'Test Image 1',
              creator: 'Test Creator',
              url: 'https://example.com/test1.jpg',
              license: 'CC-BY',
              tags: [{ name: 'tag1' }, { name: 'tag2' }]
            }
          ],
          count: 1
        }
      });
    }
    if (url.includes('/audio/')) {
      return Promise.resolve({
        data: {
          results: [
            {
              id: 'test-audio-1',
              title: 'Test Audio 1',
              creator: 'Test Creator',
              url: 'https://example.com/test1.mp3',
              license: 'CC-BY',
              duration: 120
            }
          ],
          count: 1
        }
      });
    }
    return Promise.reject(new Error('Not found'));
  })
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.OPENVERSE_CLIENT_ID = 'test-client-id';
process.env.OPENVERSE_CLIENT_SECRET = 'test-client-secret';

describe('Search API Endpoints', () => {
  let app;
  let mongoServer;
  let testUser;
  let testUserId;
  let testToken;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashedpassword'
    });
    await testUser.save();
    testUserId = testUser._id;

    // Create JWT token for test user
    testToken = jwt.sign({ id: testUserId }, process.env.JWT_SECRET);

    // Set up Express app
    app = express();
    app.use(express.json());

    // Add test middleware to mock authenticated user
    app.use((req, res, next) => {
      if (req.headers.authorization) {
        req.user = { id: testUserId };
      }
      next();
    });

    // Apply routes
    app.use('/api/search', searchRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear test data
    await Search.deleteMany({});
  });

  describe('GET /api/search', () => {
    test('should search for images', async () => {
      const res = await request(app)
        .get('/api/search')
        .query({ query: 'test', mediaType: 'images' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.results).toHaveLength(1);
      expect(res.body.data.results[0].title).toBe('Test Image 1');
    });

    test('should search for audio', async () => {
      const res = await request(app)
        .get('/api/search')
        .query({ query: 'test', mediaType: 'audio' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.results).toHaveLength(1);
      expect(res.body.data.results[0].title).toBe('Test Audio 1');
    });

    test('should return 400 if query is missing', async () => {
      const res = await request(app)
        .get('/api/search')
        .query({ mediaType: 'images' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should save search to history for authenticated users', async () => {
      const res = await request(app)
        .get('/api/search')
        .set('Authorization', `Bearer ${testToken}`)
        .query({ query: 'test', mediaType: 'images' });

      expect(res.statusCode).toBe(200);
      
      // Check if search was saved to history
      const searchHistory = await Search.find({ userId: testUserId });
      expect(searchHistory).toHaveLength(1);
      expect(searchHistory[0].query).toBe('test');
      expect(searchHistory[0].mediaType).toBe('images');
    });
  });

  describe('GET /api/search/history', () => {
    beforeEach(async () => {
      // Create test search history
      await Search.create({
        userId: testUserId,
        query: 'test query 1',
        mediaType: 'images',
        timestamp: new Date()
      });
      
      await Search.create({
        userId: testUserId,
        query: 'test query 2',
        mediaType: 'audio',
        timestamp: new Date()
      });
    });

    test('should get search history for authenticated user', async () => {
      const res = await request(app)
        .get('/api/search/history')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    test('should return 401 for unauthenticated requests', async () => {
      const res = await request(app)
        .get('/api/search/history');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/search/history/:id', () => {
    let testSearchId;

    beforeEach(async () => {
      // Create test search history
      const search = await Search.create({
        userId: testUserId,
        query: 'test delete',
        mediaType: 'images',
        timestamp: new Date()
      });
      
      testSearchId = search._id;
    });

    test('should delete search from history', async () => {
      const res = await request(app)
        .delete(`/api/search/history/${testSearchId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify search was deleted
      const searchExists = await Search.findById(testSearchId);
      expect(searchExists).toBeNull();
    });

    test('should return 401 for unauthenticated requests', async () => {
      const res = await request(app)
        .delete(`/api/search/history/${testSearchId}`);

      expect(res.statusCode).toBe(401);
    });

    test('should return 404 if search not found', async () => {
      const res = await request(app)
        .delete('/api/search/history/60c72b2f5e7f894e3cdb1234')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.statusCode).toBe(404);
    });

    test('should return 403 if user tries to delete another user\'s search', async () => {
      // Create another user
      const otherUser = new User({
        name: 'Other User',
        email: 'other@example.com',
        passwordHash: 'hashedpassword'
      });
      await otherUser.save();
      
      // Create search for other user
      const otherSearch = await Search.create({
        userId: otherUser._id,
        query: 'other user search',
        mediaType: 'images',
        timestamp: new Date()
      });
      
      const res = await request(app)
        .delete(`/api/search/history/${otherSearch._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
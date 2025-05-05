// server/tests/auth.middleware.test.js
import { protect } from '../middleware/auth.middleware.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/user.model.js';

describe('Auth Middleware', () => {
  let mongoServer;
  let mockRequest;
  let mockResponse;
  let nextFunction;
  let testUser;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

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

    // Create a test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashedpassword'
    });
    await testUser.save();

    // Mock request, response, and next function
    mockRequest = {};
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(() => mockResponse)
    };
    nextFunction = jest.fn();
  });

  test('should pass if token is valid', async () => {
    // Create valid token
    const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);
    
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    await protect(mockRequest, mockResponse, nextFunction);

    // Expect next to have been called
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user._id.toString()).toBe(testUser._id.toString());
  });

  test('should fail if no token provided', async () => {
    mockRequest.headers = {};

    await protect(mockRequest, mockResponse, nextFunction);

    // Expect response status to be 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('no token')
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should fail if token is invalid', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalidtoken'
    };

    await protect(mockRequest, mockResponse, nextFunction);

    // Expect response status to be 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('token failed')
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should fail if user not found', async () => {
    // Create valid token but with non-existent user
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET);
    
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    await protect(mockRequest, mockResponse, nextFunction);

    // Expect response status to be 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('user not found')
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
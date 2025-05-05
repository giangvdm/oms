import { searchMedia, getMediaDetails, getSearchHistory, deleteSearch } from '../controllers/search.controller.js';
import Search from '../models/search.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Mock axios
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
    if (url.includes('/images/test-image-1/')) {
      return Promise.resolve({
        data: {
          id: 'test-image-1',
          title: 'Test Image 1',
          creator: 'Test Creator',
          url: 'https://example.com/test1.jpg',
          license: 'CC-BY',
          tags: [{ name: 'tag1' }, { name: 'tag2' }]
        }
      });
    }
    return Promise.reject(new Error('Not found'));
  })
}));

// Mock cache
jest.mock('../utils/lruCache.js', () => {
  const originalModule = jest.requireActual('../utils/lruCache.js');
  
  return {
    ...originalModule,
    LRUCache: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      size: jest.fn(),
      cleanup: jest.fn()
    }))
  };
});

describe('Search Controller', () => {
  let mongoServer;
  let mockRequest;
  let mockResponse;
  let testUser;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Set test environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.OPENVERSE_CLIENT_ID = 'test-client-id';
    process.env.OPENVERSE_CLIENT_SECRET = 'test-client-secret';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear data before each test
    await Search.deleteMany({});
    await User.deleteMany({});

    // Create a test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hashedpassword'
    });
    await testUser.save();

    // Mock request and response
    mockRequest = {
      query: {},
      params: {},
      user: {
        id: testUser._id
      }
    };
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(() => mockResponse)
    };
  });

  describe('searchMedia', () => {
    test('should return search results for images', async () => {
      mockRequest.query = {
        query: 'test',
        mediaType: 'images'
      };

      await searchMedia(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            results: expect.arrayContaining([
              expect.objectContaining({
                id: 'test-image-1'
              })
            ])
          })
        })
      );
    });

    test('should save search to history for authenticated users', async () => {
      mockRequest.query = {
        query: 'test',
        mediaType: 'images'
      };

      await searchMedia(mockRequest, mockResponse);

      // Check if search was saved to history
      const searches = await Search.find({ userId: testUser._id });
      expect(searches).toHaveLength(1);
      expect(searches[0].query).toBe('test');
      expect(searches[0].mediaType).toBe('images');
    });

    test('should return 400 if query is missing', async () => {
      mockRequest.query = {
        mediaType: 'images'
      };

      await searchMedia(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    test('should format filters correctly', async () => {
      mockRequest.query = {
        query: 'test',
        mediaType: 'images',
        license: 'CC-BY',
        creator: 'Test Creator',
        tags: 'tag1,tag2'
      };

      await searchMedia(mockRequest, mockResponse);

      // Check that axios.get was called with correct params
      const axiosGet = require('axios').get;
      expect(axiosGet).toHaveBeenCalledWith(
        expect.stringContaining('/images/'),
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'test',
            license: 'CC-BY',
            creator: 'Test Creator',
            tags: 'tag1,tag2'
          })
        })
      );
    });
  });

  describe('getMediaDetails', () => {
    test('should return media details', async () => {
      mockRequest.params = {
        id: 'test-image-1'
      };
      mockRequest.query = {
        mediaType: 'images'
      };

      await getMediaDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'test-image-1',
            title: 'Test Image 1'
          })
        })
      );
    });

    test('should return 400 if id is missing', async () => {
      mockRequest.params = {};
      mockRequest.query = {
        mediaType: 'images'
      };

      await getMediaDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });
  });

  describe('getSearchHistory', () => {
    test('should return user search history', async () => {
      // Create some search history
      await Search.create([
        {
          userId: testUser._id,
          query: 'test1',
          mediaType: 'images',
          timestamp: new Date()
        },
        {
          userId: testUser._id,
          query: 'test2',
          mediaType: 'audio',
          timestamp: new Date()
        }
      ]);

      await getSearchHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({
              query: 'test1'
            }),
            expect.objectContaining({
              query: 'test2'
            })
          ])
        })
      );
    });
  });

  describe('deleteSearch', () => {
    test('should delete a search from history', async () => {
      // Create a search entry
      const search = await Search.create({
        userId: testUser._id,
        query: 'test',
        mediaType: 'images',
        timestamp: new Date()
      });

      mockRequest.params = {
        id: search._id
      };

      await deleteSearch(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );

      // Verify search was deleted
      const result = await Search.findById(search._id);
      expect(result).toBeNull();
    });

    test('should return 404 if search not found', async () => {
      mockRequest.params = {
        id: new mongoose.Types.ObjectId()
      };

      await deleteSearch(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    test('should not allow deleting another user\'s search', async () => {
      // Create another user
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        passwordHash: 'hashedpassword'
      });

      // Create a search for the other user
      const search = await Search.create({
        userId: otherUser._id,
        query: 'test',
        mediaType: 'images',
        timestamp: new Date()
      });

      mockRequest.params = {
        id: search._id
      };

      await deleteSearch(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );

      // Verify search was not deleted
      const result = await Search.findById(search._id);
      expect(result).not.toBeNull();
    });
  });
});
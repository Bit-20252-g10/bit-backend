import mongoose from 'mongoose';
import User from '../../src/models/user.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Model Tests', () => {
  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).toBe(userData.password);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    test('should create a user with minimal required fields', async () => {
      const userData = {
        email: 'minimal@example.com',
        password: 'pass123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).toBe(userData.password);
    });

    test('should handle missing optional fields gracefully', async () => {
      const userData = {
        email: 'optional@example.com',
        password: 'pass123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.username).toBeUndefined();
    });
  });

  describe('User Validation', () => {
    test('should allow duplicate emails (based on current schema)', async () => {
      const user1 = new User({ email: 'duplicate@example.com', password: 'pass1' });
      const user2 = new User({ email: 'duplicate@example.com', password: 'pass2' });
      
      await user1.save();
      await user2.save();
      
      const users = await User.find({ email: 'duplicate@example.com' });
      expect(users).toHaveLength(2);
    });

    test('should handle empty string values', async () => {
      const user = new User({
        username: '',
        email: 'empty@example.com',
        password: 'pass123'
      });
      
      const savedUser = await user.save();
      expect(savedUser.username).toBe('');
    });

    test('should handle null values for optional fields', async () => {
      const user = new User({
        username: null,
        email: 'null@example.com',
        password: 'pass123'
      });
      
      const savedUser = await user.save();
      expect(savedUser.username).toBeNull();
    });
  });

  describe('User Timestamps', () => {
    test('should automatically add createdAt and updatedAt', async () => {
      const userData = {
        username: 'timestamp',
        email: 'timestamp@example.com',
        password: 'pass123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
      expect(savedUser.createdAt).toBeInstanceOf(Date);
      expect(savedUser.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on save', async () => {
      const user = new User({
        username: 'update',
        email: 'update@example.com',
        password: 'pass123'
      });
      
      const savedUser = await user.save();
      const originalUpdatedAt = savedUser.updatedAt;
      
      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 100));
      savedUser.username = 'updated';
      const updatedUser = await savedUser.save();
      
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('User Edge Cases', () => {
    test('should handle special characters in username', async () => {
      const userData = {
        username: 'user@#$%^&*()',
        email: 'special@example.com',
        password: 'pass123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.username).toBe(userData.username);
    });

    test('should handle very long strings', async () => {
      const longString = 'a'.repeat(100);
      const userData = {
        username: longString,
        email: 'long@example.com',
        password: 'pass123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.username).toBe(longString);
    });

    test('should handle unicode characters', async () => {
      const userData = {
        username: '用户测试',
        email: 'unicode@example.com',
        password: 'pass123'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.username).toBe(userData.username);
    });
  });
});

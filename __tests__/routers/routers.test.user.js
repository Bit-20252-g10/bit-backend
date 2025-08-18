import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../src/models/user.js';

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

describe('User Router Tests', () => {
  describe('GET /users', () => {
    test('should return a welcome message', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Users endpoint works!');
    });
  });

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app).post('/users').send(userData);
      expect(response.status).toBe(201);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.username).toBe(userData.username);
    });

    test('should not create user without email', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };
      
      const response = await request(app).post('/users').send(userData);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/all', () => {
    test('should return all users', async () => {
      const user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'pass1'
      });
      const user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'pass2'
      });
      
      await user1.save();
      await user2.save();
      
      const response = await request(app).get('/users/all');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('should return empty array when no users', async () => {
      const response = await request(app).get('/users/all');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /users/:id', () => {
    test('should return user by id', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      const savedUser = await user.save();
      
      const response = await request(app).get(`/users/${savedUser._id}`);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });

    test('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/users/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /users/:id', () => {
    test('should update user', async () => {
      const user = new User({
        username: 'olduser',
        email: 'old@example.com',
        password: 'oldpass'
      });
      const savedUser = await user.save();
      
      const updateData = {
        username: 'newuser',
        email: 'new@example.com'
      };
      
      const response = await request(app)
        .put(`/users/${savedUser._id}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.username).toBe('newuser');
      expect(response.body.email).toBe('new@example.com');
    });
  });

  describe('DELETE /users/:id', () => {
    test('should delete user', async () => {
      const user = new User({
        username: 'todelete',
        email: 'delete@example.com',
        password: 'deletepass'
      });
      const savedUser = await user.save();
      
      const response = await request(app).delete(`/users/${savedUser._id}`);
      expect(response.status).toBe(200);
      
      const deletedUser = await User.findById(savedUser._id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('POST /users/login', () => {
    test('should login with valid credentials', async () => {
      const user = new User({
        username: 'loginuser',
        email: 'login@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // bcrypt hash for 'password'
      });
      await user.save();
      
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'login@example.com',
          password: 'password'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });

    test('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should not login with invalid password', async () => {
      const user = new User({
        username: 'loginuser',
        email: 'login@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
      });
      await user.save();
      
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});

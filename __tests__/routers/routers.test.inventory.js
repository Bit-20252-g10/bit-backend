import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Inventory from '../../src/models/inventory.js';

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
  await Inventory.deleteMany({});
});

describe('Inventory Router Tests', () => {
  describe('POST /inventory', () => {
    test('should create a new inventory item', async () => {
      const inventoryData = {
        name: 'PlayStation 5',
        type: 'consoles',
        description: 'Next-gen gaming console',
        price: 499.99,
        stock: 50
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(inventoryData);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(inventoryData.name);
      expect(response.body.type).toBe(inventoryData.type);
    });

    test('should not create inventory without required fields', async () => {
      const inventoryData = {
        type: 'consoles',
        price: 499.99
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(inventoryData);
      
      expect(response.status).toBe(400);
    });

    test('should not create inventory with invalid type', async () => {
      const inventoryData = {
        name: 'Invalid Item',
        type: 'invalid',
        price: 10.99,
        stock: 5
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(inventoryData);
      
      expect(response.status).toBe(400);
    });

    test('should not create inventory with negative price', async () => {
      const inventoryData = {
        name: 'Negative Price Item',
        type: 'accessories',
        price: -10.99,
        stock: 5
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(inventoryData);
      
      expect(response.status).toBe(400);
    });

    test('should not create inventory with negative stock', async () => {
      const inventoryData = {
        name: 'Negative Stock Item',
        type: 'games',
        price: 59.99,
        stock: -5
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(inventoryData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /inventory', () => {
    test('should return all inventory items', async () => {
      const item1 = new Inventory({
        name: 'Item 1',
        type: 'consoles',
        price: 299.99,
        stock: 10
      });
      const item2 = new Inventory({
        name: 'Item 2',
        type: 'accessories',
        price: 19.99,
        stock: 50
      });
      
      await item1.save();
      await item2.save();
      
      const response = await request(app).get('/inventory');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('should return empty array when no inventory items', async () => {
      const response = await request(app).get('/inventory');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /inventory/:id', () => {
    test('should return inventory item by id', async () => {
      const item = new Inventory({
        name: 'Test Item',
        type: 'games',
        price: 49.99,
        stock: 25
      });
      const savedItem = await item.save();
      
      const response = await request(app).get(`/inventory/${savedItem._id}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Item');
    });

    test('should return 404 for non-existent inventory item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/inventory/${fakeId}`);
      expect(response.status).toBe(404);
    });

    test('should return 400 for invalid ObjectId format', async () => {
      const response = await request(app).get('/inventory/invalid-id');
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /inventory/:id', () => {
    test('should update inventory item', async () => {
      const item = new Inventory({
        name: 'Old Item',
        type: 'consoles',
        price: 199.99,
        stock: 10
      });
      const savedItem = await item.save();
      
      const updateData = {
        name: 'Updated Item',
        price: 249.99,
        stock: 15
      };
      
      const response = await request(app)
        .put(`/inventory/${savedItem._id}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Item');
      expect(response.body.price).toBe(249.99);
      expect(response.body.stock).toBe(15);
    });

    test('should not update inventory with invalid data', async () => {
      const item = new Inventory({
        name: 'Test Item',
        type: 'accessories',
        price: 29.99,
        stock: 20
      });
      const savedItem = await item.save();
      
      const updateData = {
        price: -10.99
      };
      
      const response = await request(app)
        .put(`/inventory/${savedItem._id}`)
        .send(updateData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /inventory/:id', () => {
    test('should delete inventory item', async () => {
      const item = new Inventory({
        name: 'To Delete',
        type: 'games',
        price: 39.99,
        stock: 30
      });
      const savedItem = await item.save();
      
      const response = await request(app).delete(`/inventory/${savedItem._id}`);
      expect(response.status).toBe(200);
      
      const deletedItem = await Inventory.findById(savedItem._id);
      expect(deletedItem).toBeNull();
    });

    test('should return 404 for non-existent inventory item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/inventory/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('Inventory Edge Cases', () => {
    test('should handle games with additional fields', async () => {
      const gameData = {
        name: 'The Legend of Zelda',
        type: 'games',
        price: 59.99,
        stock: 100,
        consola: 'Nintendo Switch',
        genero: 'Adventure',
        developer: 'Nintendo',
        publisher: 'Nintendo',
        releaseYear: 2023,
        rating: 4.8,
        multiplayer: true
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(gameData);
      
      expect(response.status).toBe(201);
      expect(response.body.consola).toBe('Nintendo Switch');
      expect(response.body.rating).toBe(4.8);
    });

    test('should handle decimal prices', async () => {
      const itemData = {
        name: 'Decimal Price Item',
        type: 'accessories',
        price: 19.99,
        stock: 5
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(itemData);
      
      expect(response.status).toBe(201);
      expect(response.body.price).toBe(19.99);
    });

    test('should handle zero stock', async () => {
      const itemData = {
        name: 'Out of Stock Item',
        type: 'consoles',
        price: 299.99,
        stock: 0
      };
      
      const response = await request(app)
        .post('/inventory')
        .send(itemData);
      
      expect(response.status).toBe(201);
      expect(response.body.stock).toBe(0);
    });
  });
});

import mongoose from 'mongoose';
import Inventory from '../../src/models/inventory.js';
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
  await Inventory.deleteMany({});
});

describe('Inventory Model Tests', () => {
  describe('Inventory Creation', () => {
    test('should create inventory with all required fields', async () => {
      const inventoryData = {
        name: 'PlayStation 5',
        type: 'consoles',
        description: 'Next-gen gaming console',
        price: 499.99,
        stock: 50,
        imageUrl: 'https://example.com/ps5.jpg',
        isActive: true
      };
      
      const inventory = new Inventory(inventoryData);
      const savedInventory = await inventory.save();
      
      expect(savedInventory._id).toBeDefined();
      expect(savedInventory.name).toBe(inventoryData.name);
      expect(savedInventory.type).toBe(inventoryData.type);
      expect(savedInventory.price).toBe(inventoryData.price);
      expect(savedInventory.stock).toBe(inventoryData.stock);
    });

    test('should create inventory with minimal required fields', async () => {
      const inventoryData = {
        name: 'Xbox Controller',
        type: 'accessories',
        price: 59.99,
        stock: 100
      };
      
      const inventory = new Inventory(inventoryData);
      const savedInventory = await inventory.save();
      
      expect(savedInventory._id).toBeDefined();
      expect(savedInventory.name).toBe(inventoryData.name);
      expect(savedInventory.description).toBeUndefined();
      expect(savedInventory.imageUrl).toContain('placehold');
    });

    test('should create inventory with default values', async () => {
      const inventoryData = {
        name: 'Nintendo Switch',
        type: 'consoles',
        price: 299.99,
        stock: 25
      };
      
      const inventory = new Inventory(inventoryData);
      const savedInventory = await inventory.save();
      
      expect(savedInventory.isActive).toBe(true);
      expect(savedInventory.imageUrl).toContain('placehold');
    });
  });

  describe('Inventory Validation', () => {
    test('should not create inventory without required fields', async () => {
      const inventoryData = {
        type: 'consoles',
        price: 299.99,
        stock: 25
      };
      
      const inventory = new Inventory(inventoryData);
      let error;
      try {
        await inventory.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    test('should not create inventory with negative stock', async () => {
      const inventoryData = {
        name: 'Negative Stock Item',
        type: 'accessories',
        price: 10.99,
        stock: -5
      };
      
      const inventory = new Inventory(inventoryData);
      let error;
      try {
        await inventory.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.stock).toBeDefined();
    });

    test('should not create inventory with invalid type', async () => {
      const inventoryData = {
        name: 'Invalid Type Item',
        type: 'invalidType',
        price: 10.99,
        stock: 5
      };
      
      const inventory = new Inventory(inventoryData);
      let error;
      try {
        await inventory.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.type).toBeDefined();
    });
  });
});

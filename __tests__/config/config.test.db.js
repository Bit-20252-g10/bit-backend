import { afterEach, jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import gamesModel from '../../src/models/games.js';

let mongoServer;

beforeAll(async () => {
 mongoServer = await MongoMemoryServer.create();
 await mongoose.connect(mongoServer.getUri());

});

afterEach(async () => {
  await gamesModel.deleteMany({});
});

afterAll(async () => {
 await mongoose.disconnect();
 await mongoServer.stop();
});

describe("Games Model", () => {
  it("Deberia crear un juego", async () => {
    // arrange
    const gameData = {
      name: 'The Legend of Zelda: Breath of the Wild',
      console: 'Nintendo Switch',
      genre: 'Adventure',
      developer: 'Nintendo EPD',
      publisher: 'Nintendo',
      releaseYear: 2017,
      description: 'An epic open-world adventure game.',
      price: 59.99,
    };
    
    // act
    const mockGame = await gamesModel.create(gameData);

    // assert
    expect(mockGame._id).toBeDefined();
    expect(mockGame.name).toBe(gameData.name);
    expect(mockGame.console).toBe(gameData.console);
    expect(mockGame.genre).toBe(gameData.genre);
    expect(mockGame.developer).toBe(gameData.developer);
    expect(mockGame.publisher).toBe(gameData.publisher);
    expect(mockGame.releaseYear).toBe(gameData.releaseYear);
  });
});e
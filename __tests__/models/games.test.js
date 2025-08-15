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
  it("should create a game", async () => {
    // arrange
const gameData = {
  name: 'The Legend of Zelda: Breath of the Wild',
  consola: 'Nintendo', 
  genero: 'Aventura', 
  descripcion: 'Un juego épico de mundo abierto.',
  precio: 59.99,
};
    // act
    const mockGame = await gamesModel.create(gameData);

    // assert
    expect(mockGame._id).toBeDefined();
    expect(mockGame.title).toBe(gameData.title);
    expect(mockGame.genre).toBe(gameData.genre);
  });
});
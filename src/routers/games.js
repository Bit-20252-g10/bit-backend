import { Router } from 'express';
import gamesController from '../controllers/games.js';

const gamesRouter = Router();

gamesRouter.post("/", gamesController.create); 
gamesRouter.get("/", gamesController.readAll); 
gamesRouter.get("/:id", gamesController.readOne); 
gamesRouter.put("/", gamesController.updateWithoutId);
gamesRouter.put("/:id", gamesController.update);  
gamesRouter.delete("/:id", gamesController.delete); 

gamesRouter.get("/console/:consola", gamesController.getByConsole);
gamesRouter.get("/genre/:genero", gamesController.getByGenre);
gamesRouter.get("/multiplayer/available", gamesController.getMultiplayer);
gamesRouter.get("/stock/available", gamesController.getInStock);
gamesRouter.get("/playstation", (req, res) => gamesController.getByConsole({ params: { consola: 'PlayStation' } }, res));
gamesRouter.get("/xbox", (req, res) => gamesController.getByConsole({ params: { consola: 'Xbox' } }, res));
gamesRouter.get("/nintendo", (req, res) => gamesController.getByConsole({ params: { consola: 'Nintendo' } }, res));

export default gamesRouter;
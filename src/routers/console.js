import { Router } from 'express';
import consoleController from '../controllers/console.js';

const consoleRouter = Router();

consoleRouter.post("/", consoleController.create);
consoleRouter.get("/", consoleController.readAll);
consoleRouter.get("/:id", consoleController.readOne);
consoleRouter.put("/:id", consoleController.update);
consoleRouter.delete("/:id", consoleController.delete);

consoleRouter.get("/brand/:brand", consoleController.getByBrand);
consoleRouter.get("/model/:model", consoleController.getByModel);
consoleRouter.get("/stock/available", consoleController.getInStock);
consoleRouter.get("/year/:year", consoleController.getByReleaseYear);
consoleRouter.get("/feature/:feature", consoleController.getByFeature);
consoleRouter.get("/latest/all", consoleController.getLatest);

consoleRouter.get("/playstation", (req, res) => consoleController.getByBrand({ params: { brand: 'PlayStation' } }, res));
consoleRouter.get("/xbox", (req, res) => consoleController.getByBrand({ params: { brand: 'Xbox' } }, res));
consoleRouter.get("/nintendo", (req, res) => consoleController.getByBrand({ params: { brand: 'Nintendo' } }, res));

export default consoleRouter; 
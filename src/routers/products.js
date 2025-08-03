import { Router } from 'express';
import GameModel from '../models/games.js';
import AccessoryModel from '../models/accessory.js';
import ConsoleModel from '../models/console.js';
import gamesController from '../controllers/games.js';
import accessoryController from '../controllers/accessory.js';
import consoleController from '../controllers/console.js';


const productsRouter = Router();

// GET all products
productsRouter.get("/", async (req, res) => {
  try {
    const [games, accessories, consoles] = await Promise.all([
      GameModel.find({ isActive: true }),
      AccessoryModel.find({ isActive: true }),
      ConsoleModel.find({ isActive: true }),
    ]);

    let products = [
      ...games,
      ...accessories,
      ...consoles,
    ];
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      allOK: true,
      message: "Productos obtenidos exitosamente",
      data: products,
    });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({
      allOK: false,
      message: "Error al obtener productos",
      data: error.message,
    });
  }
});

// GET specific categories
productsRouter.get("/games", (req, res) => {
  console.log("GET /products/games called");
  gamesController.readAll(req, res);
});

productsRouter.get("/accessories", (req, res) => {
  console.log("GET /products/accessories called");
  accessoryController.readAll(req, res);
});

productsRouter.get("/consoles", (req, res) => {
  console.log("GET /products/consoles called");
  consoleController.readAll(req, res);
});

// POST endpoints
productsRouter.post("/games", (req, res) => gamesController.create(req, res));
productsRouter.post("/consoles", (req, res) => consoleController.create(req, res));
productsRouter.post("/accessories", (req, res) => accessoryController.create(req, res));

// PUT endpoints for updating
productsRouter.put("/games/:id", (req, res) => gamesController.update(req, res));
productsRouter.put("/consoles/:id", (req, res) => consoleController.update(req, res));
productsRouter.put("/accessories/:id", (req, res) => accessoryController.update(req, res));

// DELETE endpoints
productsRouter.delete("/games/:id", (req, res) => gamesController.delete(req, res));
productsRouter.delete("/consoles/:id", (req, res) => consoleController.delete(req, res));
productsRouter.delete("/accessories/:id", (req, res) => accessoryController.delete(req, res));

// GET specific items by ID (must come after specific routes)
productsRouter.get("/games/:id", (req, res) => gamesController.readOne(req, res));
productsRouter.get("/consoles/:id", (req, res) => consoleController.readOne(req, res));
productsRouter.get("/accessories/:id", (req, res) => accessoryController.readOne(req, res));

// Generic product search by ID (must be last)
productsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let found = false;
    await gamesController.readOne({ params: { id } }, {
      ...res,
      json: (data) => {
        if (data?.data) {
          found = true;
          res.json(data);
        }
      }
    });
    if (found) return;

    await accessoryController.readOne({ params: { id } }, {
      ...res,
      json: (data) => {
        if (data?.data) {
          found = true;
          res.json(data);
        }
      }
    });
    if (found) return;

    await consoleController.readOne({ params: { id } }, {
      ...res,
      json: (data) => {
        if (data?.data) {
          found = true;
          res.json(data);
        }
      }
    });
    if (found) return;

    res.status(404).json({
      allOK: false,
      message: "Producto no encontrado",
      data: null,
    });
  } catch (error) {
    console.error("Error buscando producto:", error);
    res.status(500).json({
      allOK: false,
      message: "Error al buscar producto",
      data: error.message,
    });
  }
});

export default productsRouter; 
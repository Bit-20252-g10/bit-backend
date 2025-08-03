import { Router } from 'express';
import accessoryController from '../controllers/accessory.js';

const accessoryRouter = Router();

// Rutas CRUD básicas
accessoryRouter.post("/", accessoryController.create);
accessoryRouter.get("/", accessoryController.readAll);
accessoryRouter.get("/:id", accessoryController.readOne);
accessoryRouter.put("/:id", accessoryController.update);
accessoryRouter.delete("/:id", accessoryController.delete);

// Rutas específicas para accesorios
accessoryRouter.get("/category/:category", accessoryController.getByCategory);
accessoryRouter.get("/brand/:brand", accessoryController.getByBrand);
accessoryRouter.get("/compatible/:console", accessoryController.getCompatibleWith);
accessoryRouter.get("/stock/available", accessoryController.getInStock);
accessoryRouter.get("/wireless/available", accessoryController.getWireless);

// Rutas específicas por categoría
accessoryRouter.get("/controles", (req, res) => accessoryController.getByCategory({ params: { category: 'Controles' } }, res));
accessoryRouter.get("/audifonos", (req, res) => accessoryController.getByCategory({ params: { category: 'Audífonos' } }, res));
accessoryRouter.get("/cargadores", (req, res) => accessoryController.getByCategory({ params: { category: 'Cargadores' } }, res));
accessoryRouter.get("/almacenamiento", (req, res) => accessoryController.getByCategory({ params: { category: 'Almacenamiento' } }, res));
accessoryRouter.get("/cables", (req, res) => accessoryController.getByCategory({ params: { category: 'Cables' } }, res));
accessoryRouter.get("/fundas", (req, res) => accessoryController.getByCategory({ params: { category: 'Fundas' } }, res));

// Rutas específicas por marca
accessoryRouter.get("/playstation", (req, res) => accessoryController.getByBrand({ params: { brand: 'PlayStation' } }, res));
accessoryRouter.get("/xbox", (req, res) => accessoryController.getByBrand({ params: { brand: 'Xbox' } }, res));
accessoryRouter.get("/nintendo", (req, res) => accessoryController.getByBrand({ params: { brand: 'Nintendo' } }, res));

export default accessoryRouter; 
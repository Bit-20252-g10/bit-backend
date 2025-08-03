import { Router } from 'express';
import homeController from '../controllers/home.js';

const homeRouter = Router();

homeRouter.get("/", homeController.getHomeData);

homeRouter.get("/categories", homeController.getCategories);

homeRouter.get("/features", homeController.getFeatures);

homeRouter.get("/featured-games", homeController.getFeaturedGames);

homeRouter.post("/categories", homeController.createCategory);

homeRouter.post("/features", homeController.createFeature);

homeRouter.put("/hero", homeController.updateHero);

export default homeRouter; 
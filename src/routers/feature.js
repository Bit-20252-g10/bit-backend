import { Router } from 'express';
import featureController from '../controllers/feature.js';

const featureRouter = Router();

featureRouter.post("/", featureController.create);
featureRouter.get("/", featureController.readAll);
featureRouter.get("/:id", featureController.readOne);
featureRouter.put("/:id", featureController.update);
featureRouter.delete("/:id", featureController.delete);

featureRouter.get("/active/all", featureController.getActive);
featureRouter.get("/title/:title", featureController.getByTitle);
featureRouter.get("/icon/:icon", featureController.getByIcon);
featureRouter.get("/featured/all", featureController.getFeatured);
featureRouter.put("/order/update", featureController.updateOrder);
featureRouter.put("/:id/toggle", featureController.toggleActive);

export default featureRouter; 
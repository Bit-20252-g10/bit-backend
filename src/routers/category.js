import { Router } from 'express';
import categoryController from '../controllers/category.js';

const categoryRouter = Router();

categoryRouter.post("/", categoryController.create);
categoryRouter.get("/", categoryController.readAll);
categoryRouter.get("/:id", categoryController.readOne);
categoryRouter.put("/:id", categoryController.update);
categoryRouter.delete("/:id", categoryController.delete);

categoryRouter.get("/active/all", categoryController.getActive);
categoryRouter.get("/route/:route", categoryController.getByRoute);
categoryRouter.put("/order/update", categoryController.updateOrder);
categoryRouter.put("/:id/toggle", categoryController.toggleActive);

export default categoryRouter; 
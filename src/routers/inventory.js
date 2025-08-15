import { Router } from "express";
import inventoryController from "../controllers/inventory.js";

const router = Router();


router.post("/", inventoryController.create);
router.get("/", inventoryController.readAll);
router.get("/:id", inventoryController.readOne);
router.put("/:id", inventoryController.update);
router.delete("/:id", inventoryController.delete);

export default router;
import { Router } from "express";
import { addFolder, deleteFolder, fetchFolders } from "../controllers/FolderController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = Router()

router.post("/", protectRoutes, addFolder);

router.get("/",protectRoutes, fetchFolders);

router.delete("/:id",protectRoutes, deleteFolder);

export default router;
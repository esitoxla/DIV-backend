import { Router } from "express";
import { createQrCode, deleteQrcode, getVendorsQrCode, updateQRCodeStatus } from "../controllers/qrCodeController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = Router();

router.post("/", protectRoutes, createQrCode);

router.get("/", protectRoutes, getVendorsQrCode);

router.put("/:id",protectRoutes, updateQRCodeStatus);

router.delete("/:id",protectRoutes, deleteQrcode);

export default router;
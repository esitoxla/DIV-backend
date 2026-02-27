import { scanQrCode } from "../controllers/scan.controller";
import { Router } from "express";

const router = Router()

router.get("/scan/:id", scanQrCode);

export default router;
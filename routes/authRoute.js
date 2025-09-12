import { Router } from "express";
import { forgotPassword, getUser, login, logout, profileUpload, register, updateUserById } from "../controllers/authController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { fileUpload } from "../config/fileUpload.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);

router.get("/me", getUser);

router.post("/upload", protectRoutes, fileUpload.single('avatar'),profileUpload)

router.put("/:id", updateUserById);



export default router;

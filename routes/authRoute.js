import { Router } from "express";
import { changePassword, checkLink, forgotPassword, getUser, login, logout, profileUpload, register, resetPassword, updateUserById } from "../controllers/authController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { fileUpload } from "../config/fileUpload.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword/:resetToken", resetPassword);

router.get("/checklink/:resetToken", checkLink);

router.post("/changePassword", protectRoutes, changePassword);

router.get("/me", getUser);

router.post("/upload", protectRoutes, fileUpload.single('avatar'),profileUpload)

router.put("/update", protectRoutes, updateUserById);



export default router;

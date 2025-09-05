import { Router, } from "express"
import { forgotPassword, login, logout, register, resetPassword, test } from "../controllers/authController.js";
import { routeProtect } from "../middlewares/routeProtect.js";

const router = Router();
// "/api/auth/register"
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/test", routeProtect, test)
router.post("/forgotPassword", forgotPassword)
router.post("/resetPassword/:resetPasswordToken", resetPassword)


export default router;
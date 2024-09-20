import authController from "../controllers/authController.js";
import express from "express";

const authRouter = express.Router();
authRouter.get("/signup", authController.renderAuthPage(false));
authRouter.post("/signup", authController.signup);

authRouter.get("/login", authController.renderAuthPage(true));
authRouter.post("/login", authController.login);

authRouter.get("/logout", authController.logout);

export default authRouter;

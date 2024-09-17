import pageController from "../controllers/pageController.js";
import express from "express";

const pageRouter = express.Router();
pageRouter.get("/", pageController.home);

export default pageRouter;

import pageController from "../controllers/pageController.js";
import express from "express";

const pageRouter = express.Router();
pageRouter.get("/", pageController.renderHomePage);
pageRouter.get("/about", pageController.renderAboutPage);

pageRouter.get("/folders/:id", pageController.renderFolderPage);

export default pageRouter;

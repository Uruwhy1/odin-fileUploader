import express from "express";
import fileController from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post("/upload", fileController.handleFileUpload);

export default fileRouter;

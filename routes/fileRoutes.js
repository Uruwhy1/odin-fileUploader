import express from "express";
import fileController from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post("/upload", fileController.uploadFile);

fileRouter.post("/folders", fileController.createFolder);
fileRouter.post("/folders/:id/edit", fileController.renameFolder);
fileRouter.post("/folders/:id/delete", fileController.deleteFolder);
export default fileRouter;

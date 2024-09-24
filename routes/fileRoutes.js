import express from "express";
import fileController from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post("/folders/:id/upload", fileController.uploadFile);

fileRouter.post("/folders", fileController.createFolder);
// fileRouter.get("/folders/:id", fileController.getFolder);
// fileRouter.put("/folders/:id", fileController.updateFolder);
fileRouter.post("/folders/:id/delete", fileController.deleteFolder);
export default fileRouter;

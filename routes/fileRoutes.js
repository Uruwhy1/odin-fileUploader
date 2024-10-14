import express from "express";
import fileController from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post("/upload", fileController.uploadFile);
fileRouter.post("/rename/:id", fileController.renameFile);
fileRouter.post("/delete/:id", fileController.deleteFile);

fileRouter.post("/folders", fileController.createFolder);
fileRouter.post("/folders/:id/rename", fileController.renameFolder);
fileRouter.post("/folders/:id/delete", fileController.deleteFolder);

fileRouter.get("/folders/:folderId/files", fileController.getFilesForFolder);
fileRouter.get("/files/recent", fileController.getLastTenFiles);

export default fileRouter;

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import prisma from "../prismaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadFile = [
  upload.single("file"),
  (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.redirect("/?sucess");
  },
];

const createFolder = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const { name } = req.body;
  const userId = req.user.id;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });

    res.redirect("/?sucess");
  } catch (error) {
    res.status(500).json({ error: "Failed to create folder" });
  }
};

const deleteFolder = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const folderId = parseInt(req.params.id, 10);

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    // check if the folder belongs to the current user
    if (!folder || folder.userId !== req.user.id) {
      return res
        .status(403)
        .send("You are a bad person. Or the page is broken.");
    }

    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  uploadFile,
  createFolder,
  deleteFolder,
};

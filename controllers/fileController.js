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

export default {
  uploadFile,
  createFolder,
};

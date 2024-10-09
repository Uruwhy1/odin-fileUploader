import multer from "multer";
import cloudinary from "cloudinary";
import prisma from "../prismaClient.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = [
  upload.single("file"),
  async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const folderId = parseInt(req.body.folderId, 10);
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).send("Unauthorized folder selection.");
    }

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto" },
        async (error, result) => {
          if (error) {
            return res.status(500).send("Error uploading to Cloudinary");
          }

          await prisma.file.create({
            data: {
              name: req.body.name,
              size: req.file.size,
              publicId: result.public_id,
              path: result.secure_url,
              folderId: folderId,
              userId: req.user.id,
            },
          });

          res.redirect("/?success");
        }
      );

      stream.end(req.file.buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      res.status(500).send("Internal Server Error");
    }
  },
];

const deleteFile = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const { id: publicId } = req.params;
  const { fileId } = req.body;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    const resourceType =
      file.type === "image" ? "image" : file.type === "video" ? "video" : "raw";

    if (!file || file.userId !== req.user.id) {
      return res.status(403).send("Unauthorized to delete this file.");
    }

    await cloudinary.v2.uploader.destroy(file.publicId, {
      resource_type: resourceType,
    });

    await prisma.file.delete({
      where: { id: fileId },
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Internal Server Error");
  }
};

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

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).send("Internal Server Error");
  }
};

const renameFolder = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const folderId = parseInt(req.params.id, 10);
  const newName = req.body.newName.trim();

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res
        .status(403)
        .send("You do not have permission to rename this folder.");
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: { name: newName },
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error renaming folder:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getFilesForFolder = async (req, res) => {
  const folderId = parseInt(req.params.folderId, 10);

  try {
    const files = await prisma.file.findMany({
      where: { folderId: folderId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files." });
  }
};

const getLastTenFiles = async (req, res) => {
  try {
    const recentFiles = await prisma.file.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    res.status(200).json(recentFiles);
  } catch (error) {
    console.error("Error fetching recent files:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  uploadFile,
  deleteFile,
  createFolder,
  deleteFolder,
  renameFolder,
  getFilesForFolder,
  getLastTenFiles,
};

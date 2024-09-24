import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

const handleFileUpload = [
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

export default {
  handleFileUpload,
};

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadBasePath = path.join(__dirname, "../../public/uploads");

// Required folders
const folders = [
  "profile",
  "logo",
  "banner",
  "background",
  "icons",
  "thumbnails",
  "media",
  "products",
  "product_files",
];

// Ensure folders exist
folders.forEach((folder) => {
  const folderPath = path.join(uploadBasePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    switch (file.fieldname) {
      case "profilePicture":
        folder = "profile";
        break;
      case "logo":
      case "logo_file":
        folder = "logo";
        break;
      case "banner":
        folder = "banner";
        break;
      case "backgroundImage":
        folder = "background";
        break;
      case "icon":
        folder = "icons";
        break;
      case "thumbnail":
        folder = "thumbnails";
        break;
      case "media":
        folder = "media";
        break;
      case "productImage":
        folder = "products";
        break;
      case "productFile":
        folder = "product_files";
        break;
      case "productFileImage":
      case "productLinkImage":
        folder = "products"; // Store file/link preview images in products folder
        break;
      default:
        return cb(new Error("Invalid field name for upload"), null);
    }

    cb(null, path.join(uploadBasePath, folder));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + Math.random().toString(36).slice(2, 8) + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Allow all file types for product files, but restrict others to images
  if (file.fieldname === "productFile") {
    cb(null, true);
  } else if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;

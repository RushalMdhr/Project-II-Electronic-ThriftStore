// middlewares/multer.js
import multer from "multer";
import path from "path";

// Define storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads";
    if (req.baseUrl.includes("categories")) {
      folder = path.join("uploads", "categories");
    }
    // Review uploads
    if (req.baseUrl.includes("reviews")) {
      folder = path.join("uploads", "reviews");
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(
      null,
      `${path.basename(file.originalname, extname)}-${Date.now()}${extname}`
    );
  },
});

// Define filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp$/;
  const minetypes = /image\/jpe?g|image\/png|image\/webp/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (filetypes.test(ext) && minetypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

// Initialize Multer with storage and filter
const upload = multer({ storage, fileFilter });

export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images");

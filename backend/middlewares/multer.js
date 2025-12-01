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

// Profile picture storage
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${extname}`);
  },
});

// Cover picture storage
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cover");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `cover-${Date.now()}${extname}`);
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

// Create separate upload instances
export const uploadProfilePic = multer({
  storage: profileStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single("profilePic");

export const uploadCoverPic = multer({
  storage: coverStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB for cover (larger)
}).single("coverPic");

export const uploadBothPics = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "profilePic") {
        cb(null, "uploads/profile");
      } else if (file.fieldname === "coverPic") {
        cb(null, "uploads/cover");
      }
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      const prefix = file.fieldname === "profilePic" ? "profile" : "cover";
      cb(null, `${prefix}-${Date.now()}${extname}`);
    }
  }),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max per file
}).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "coverPic", maxCount: 1 }
]);

// Initialize Multer with storage and filter
const upload = multer({ storage, fileFilter });

export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images");

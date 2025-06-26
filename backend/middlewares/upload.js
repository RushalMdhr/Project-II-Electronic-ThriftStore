import multer from "multer";
import path from "path";
import fs from "fs";
import  {fileURLToPath } from "url";
import  {dirname} from "path";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to 'uploadimage' folder inside backend
const uploadPath = path.join(__dirname, "..", "uploadimage");

 

// Create folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;

// routes/uploadRoutes.js
import express from "express";
import { uploadMultiple } from "../middlewares/multer.js"; // <-- use the modular version

const router = express.Router();

router.post("/", (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    const paths = req.files.map((file) => `/${file.path}`);
    res.status(200).json({
      message: "Images uploaded successfully",
      paths,
    });
  });
});

export default router;

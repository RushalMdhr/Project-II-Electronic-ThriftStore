import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTopCategories,
} from "../controllers/categoryControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { uploadSingle } from "../middlewares/multer.js"; // ✅ import upload middleware

const router = express.Router();

// List all categories & Create category with image upload
router
  .route("/")
  .get(getAllCategories)
  .post(authenticate, uploadSingle, createCategory); // ✅ add uploadSingle here

// Get top categories
router.route("/topcategories").get(getTopCategories);

// Update & delete category with optional image update
router
  .route("/:id")
  .put(authenticate, uploadSingle, updateCategory) // ✅ add uploadSingle here
  .delete(authenticate, deleteCategory);

export default router;

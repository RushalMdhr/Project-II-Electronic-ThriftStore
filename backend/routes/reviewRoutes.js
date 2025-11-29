import express from "express";
import {
  createReview,
  getReviewsByProduct,
  getReviewsBySeller,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { uploadMultiple } from "../middlewares/multer.js";
const router = express.Router();

// Create review
router.post("/", authenticate, uploadMultiple, createReview);

// Get reviews of a product
router.get("/product/:productId", getReviewsByProduct);

// Get reviews of a seller
router.get("/seller/:sellerId", getReviewsBySeller);

// Delete review
router.delete("/:id", authenticate, deleteReview);

export default router;

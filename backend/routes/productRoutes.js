// routes/productRoutes.js
import express from "express";
import {
  getAllProducts,
  deleteProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.delete("/products/:id", deleteProductById);

export default router;

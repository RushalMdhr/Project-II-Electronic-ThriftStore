// routes/productRoutes.js
import express from "express";
import formidable from "express-formidable";
import {
  getAllProducts,
  deleteProductById,
  createProduct,
  updateProductDetails,
  fetchProducts,
  getProductById,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
} from "../controllers/productController.js";
import checkId from "../middlewares/checkId.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/allproducts").get(getAllProducts);

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), createProduct);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:productId")
  .get(getProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, deleteProductById);

router
  .route("/:productId/reviews")
  .post(authenticate, authorizeAdmin, checkId, addProductReview);


export default router;

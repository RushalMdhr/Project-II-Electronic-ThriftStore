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
  getMyProducts
} from "../controllers/productController.js";
import checkId from "../middlewares/checkId.js";
import { authenticate, authorizeAdmin,authorizeVendor,authorizeAdminOrVendor,isAuthenticated} from "../middlewares/authMiddleware.js";

const   router = express.Router();

router.route("/getmyproducts").get(authenticate, authorizeVendor, getMyProducts);

router.route("/allproducts").get(getAllProducts);

router
  .route("/")
  .get(isAuthenticated ,fetchProducts)
  .post(authenticate, authorizeVendor, formidable(), createProduct);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:productId")
  .get(getProductById)
  .put(authenticate, authorizeAdminOrVendor, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdminOrVendor, deleteProductById);

// router
//   .route("/:productId/reviews")
//   .post(authenticate, authorizeAdmin, checkId, addProductReview);


export default router;

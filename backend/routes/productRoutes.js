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
  fetchTopProducts,
  fetchNewProducts,
  getMyProducts,
  increaseViewCount,
  fetchGroupedProducts,
  reportProduct,
  getPriceRange,
  getBlackListedProducts,
  addToBlackList,
  removeReportFromProduct,
} from "../controllers/productController.js";
import {
  authenticate,
  authorizeAdmin,
  authorizeVendor,
  authorizeAdminOrVendor,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getpricerange", getPriceRange);
router.get(
  "/getBlackListedProducts",
  authenticate,
  authorizeAdmin,
  getBlackListedProducts
);

router
  .route("/:productId/addToBlackList")
  .post(authenticate, authorizeAdmin, addToBlackList);
router.route("/:productId/reported").post(authenticate, reportProduct);
// routes/productRoutes.js
router.delete(
  "/:productId/report/:userId",
  authenticate,
  removeReportFromProduct
);

// router.route("/getmyproducts/:vendorId").get(authenticate, getMyProducts);
router.get(
  "/getmyproducts/:vendorId",
  authenticate,
  authorizeVendor,
  getMyProducts
);

router.route("/:productId/views").put(isAuthenticated, increaseViewCount);

router.route("/allproducts").get(getAllProducts);

router
  .route("/")
  .get(isAuthenticated, fetchProducts)
  .post(authenticate, authorizeVendor, formidable(), createProduct);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/groupedProducts", fetchGroupedProducts);

router
  .route("/:productId")
  .get(getProductById)
  .put(authenticate, authorizeAdminOrVendor, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdminOrVendor, deleteProductById);

// router
//   .route("/:productId/reviews")
//   .post(authenticate, authorizeAdmin, checkId, addProductReview);

export default router;

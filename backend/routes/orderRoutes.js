import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getSoldOrders,
  updateVendorOrderStatus,
  deleteErrorOrder,
} from "../controllers/orderController.js";
import {
  authenticate,
  authorizeAdmin,
  authorizeVendor,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticate, createOrder);
// .get(authenticate, authorizeVendor, getOrders);
router.route("/myorders").get(authenticate, getMyOrders);
router.route("/soldorders").get(authenticate, authorizeVendor, getSoldOrders);
router
  .route("/:orderId")
  .get(authenticate, getOrderById)
  .delete(authenticate, deleteErrorOrder);
router.route("/:id/pay").put(authenticate, updateOrderToPaid);
router
  .route("/update-vendororder-status")
  .patch(authenticate, authorizeVendor, updateVendorOrderStatus);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, updateOrderToDelivered);

export default router;

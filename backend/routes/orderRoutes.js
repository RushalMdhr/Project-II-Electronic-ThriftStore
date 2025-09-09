import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getSoldOrders,
} from "../controllers/orderController.js";
import { authenticate, authorizeAdmin, authorizeVendor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeVendor, getOrders);
router.route("/myorders").get(authenticate, getMyOrders);
router.route("/soldorders").get(authenticate, authorizeVendor, getSoldOrders)
router.route("/:id").get(authenticate, getOrderById);
router.route("/:id/pay").put(authenticate, updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, updateOrderToDelivered);

export default router;

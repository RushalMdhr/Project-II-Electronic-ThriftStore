import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getOrders);
router.route("/myorders").get(authenticate, getMyOrders);
router.route("/:id").get(authenticate, getOrderById);
router.route("/:id/pay").put(authenticate, updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, updateOrderToDelivered);

export default router;

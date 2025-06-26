import express from "express";

const router = express.Router();
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

router.post("/create", createOrder);             // Create new order
router.get("/", getAllOrders);                   // Get all orders
router.get("/:id", getOrderById);                // Get order by ID
router.put("/:id/status", updateOrderStatus);    // Update order status

export default router;

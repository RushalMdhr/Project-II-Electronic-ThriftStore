import express from "express";
import {
  getVendorDashboard,
  getSalesGrowth,
  getCategoryRange,
  getRecentOrders,
  getVendorProfile,
} from "../controllers/vendorControllers.js";
import { authenticate, authorizeVendor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticate, authorizeVendor, getVendorDashboard);
router.get("/sales-growth", authenticate, authorizeVendor, getSalesGrowth);
router.get("/category-range", authenticate, authorizeVendor, getCategoryRange);
router.get("/recent-orders", authenticate, authorizeVendor, getRecentOrders);
router.get("/profile", authenticate, authorizeVendor, getVendorProfile);

export default router;

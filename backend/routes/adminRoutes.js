// routes/adminRoutes.js
import express from "express";
import { getAdminSummary } from "../controllers/adminController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/summary", authenticate, authorizeAdmin, getAdminSummary);

export default router;

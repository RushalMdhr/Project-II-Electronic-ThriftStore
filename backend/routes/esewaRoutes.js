import express from "express"
import { EsewaInitiatePayment, paymentStatus } from "../controllers/esewaController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/initiate-payment", authenticate,EsewaInitiatePayment);
router.post("/payment-status",authenticate, paymentStatus);

export default router;
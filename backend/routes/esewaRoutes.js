import express from "express"
import { EsewaInitiatePayment, paymentStatus } from "../controllers/esewaController.js";
const router = express.Router();

router.post("/initiate-payment", EsewaInitiatePayment);
router.post("/payment-status", paymentStatus);

export default router;
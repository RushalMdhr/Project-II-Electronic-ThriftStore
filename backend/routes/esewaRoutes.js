import express from "express"
import { EsewaInitiatePayment, getEsewaTransactions, paymentStatus } from "../controllers/esewaController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/initiate-payment", authenticate,EsewaInitiatePayment);
router.post("/payment-status",authenticate, paymentStatus);
router.get("/get-esewa-transactions",authenticate,authorizeAdmin, getEsewaTransactions);

export default router;
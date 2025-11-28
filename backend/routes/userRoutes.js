import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { createUser, loginUser, logout, deleteUser, getAllUsers, updateCurrentUserProfile, getUserById, updateUserById, updateVendorShop, getCurrentUserProfile, getPendingPaymentUsers } from "../controllers/userControllers.js";
// router using
const router = express.Router();

router.route("/")
    .get(authenticate, authorizeAdmin, getAllUsers)
    .post(createUser)

router.route("/login").post(loginUser)
router.route("/logout").post(authenticate, logout)
router.route("/vendor/shop").post(authenticate, updateVendorShop);
router.route("/pending-payment-vendor").get(authenticate,authorizeAdmin, getPendingPaymentUsers);

// --------- TO UPDATE YOUR PROFILE----------------------------
router.route("/profile").get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile)

// ---------------------- SOMEONE VISITS YOUR PROFILE -------------------------------
router.route("/:id")
    .get(authenticate, getUserById)
// ---------------------- ADMIN UPDATES PROFILE -------------------------------
    .put(authenticate, authorizeAdmin, updateUserById)
    .delete(authenticate, authorizeAdmin, deleteUser);


export default router;
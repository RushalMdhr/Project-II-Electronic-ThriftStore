import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { createUser, loginUser, logout, deleteUser, getAllUsers,updateCurrentUserProfile, getUserById, updateUserById, updateVendorShop, getCurrentUserProfile } from "../controllers/userControllers.js";
// router using
const router = express.Router();

router.route("/").post(createUser)
router.route("/login").post(loginUser)
router.route("/logout").post(authenticate, logout)

router.route("/profile").get(authenticate, getCurrentUserProfile).post(authenticate, updateCurrentUserProfile)
router.delete("/:id", deleteUser);

router.get("/:id", authenticate, authorizeAdmin, getUserById);
router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.put("/:id", authenticate, authorizeAdmin, updateUserById);
router.route("/vendor/shop").post(authenticate, updateVendorShop);

export default router;
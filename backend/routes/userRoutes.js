import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { createUser, loginUser, logout, deleteUser, getAllUsers,updateCurrentUserProfile } from "../controllers/userControllers.js";
// router using
const router = express.Router();

router.route("/").post(createUser)
router.route("/login").post(loginUser)
router.route("/logout").post(authenticate, logout)
router.route("/profile").post(authenticate, updateCurrentUserProfile)
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);

export default router;
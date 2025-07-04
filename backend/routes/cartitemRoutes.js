import express from 'express';
import {addToCart, getCartItems, updateCartItem, deleteCartItem} from "../controllers/cartItemControllers.js";
import { authenticate } from '../middlewares/authMiddleware.js';
const router =express.Router();

// Fix: accept userId as a URL parameter
router.route("/:userId").get(authenticate, getCartItems);
router.route("/add").post(authenticate,addToCart);
router.route("/:id").put(authenticate, updateCartItem).delete(authenticate, deleteCartItem);

export default router;
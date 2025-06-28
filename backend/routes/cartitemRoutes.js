import express from 'express';
import {addToCart, getCartItems, updateCartItem, deleteCartItem} from "../controllers/cartitemControllers.js";

const router =express.Router();

// Fix: accept userId as a URL parameter
router.route("/:userId").get(getCartItems);
router.route("/add").post(addToCart);
router.route("/:id").put(updateCartItem).delete(deleteCartItem);

export default router;
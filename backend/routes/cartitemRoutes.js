import express from "express";
import {
  addToCart,
  getCartItems,
  deleteCartItem,
  updateCartItemQuantity,
} from "../controllers/cartitemController.js";

const router = express.Router();

router.post("/addtocart", addToCart);
router.get("/", getCartItems);
router.delete("/:cartItemId", deleteCartItem);
router.put("/:cartItemId", updateCartItemQuantity);




export default router;

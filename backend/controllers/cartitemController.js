import CartItem from "../models/cartitemModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { userId,productId, quantity } = req.body;
  

  if (!productId || !quantity) {
    res.status(400);
    throw new Error("Missing productId or quantity");
  }

  let item = await CartItem.findOne({ userId, productId });

  if (item) {
    item.quantity += quantity;
    await item.save();
    res.status(200).json({ message: "Cart updated", item });
  } else {
    const newItem = new CartItem({ userId, productId, quantity });
    await newItem.save();
    res.status(201).json({ message: "Item added to cart", item: newItem });
  }
});

// @desc    Get user's cart items
export const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const items = await CartItem.find({ userId }).populate("productId");
  res.status(200).json(items);
});

// @desc    Update item quantity
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const item = await CartItem.findOneAndUpdate(
    { _id: cartItemId, userId: req.user._id },
    { quantity },
    { new: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  res.status(200).json(item);
});

// @desc    Delete cart item
export const deleteCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params;

  const deleted = await CartItem.findOneAndDelete({
    _id: cartItemId,
    userId: req.user._id,
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  res.status(204).end();
});

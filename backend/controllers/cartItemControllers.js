import asyncHandler from "../middlewares/asyncHandler.js"
import CartItem from '../models/cartitemModel.js';
// Add a product to cart
import Product from "../models/productModel.js"; 

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await CartItem.findOne({ user: userId, product: productId });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.status(201).json(existing);
    }

    // 🟡 Fetch price from Product model
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Create cart item
    const cartItem = await CartItem.create({
      user: userId,
      product: productId,
      quantity: quantity || 1,
      price: product.price, 
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("❌ Error in addToCart:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Get all cart items for a user
export const getCartItems = async (req, res) => {
  const userId = req.params.userId;
  console.log("Incoming userId:", userId); // debug log

  if (!userId || userId === "undefined") {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const cartItems = await CartItem.find({ user: userId }).populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to get cart items" });
  }
};


// Update quantity (increment/decrement)
export const updateCartItem = asyncHandler(async (req, res) => {
  const { action } = req.body;

  const cartItem = await CartItem.findById(req.params.id);
  if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

  if (action === "increment") {
    cartItem.quantity += 1;
  } else if (action === "decrement") {
    cartItem.quantity = Math.max(1, cartItem.quantity - 1);
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  await cartItem.save();
  res.json(cartItem);
});

// Delete cart item
export const deleteCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  res.status(204).send();
});

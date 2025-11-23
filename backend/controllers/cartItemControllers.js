import asyncHandler from "../middlewares/asyncHandler.js";
import CartItem from "../models/cartitemModel.js";
// Add a product to cart
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await CartItem.findOne({
      user: userId,
      product: productId,
    });

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
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all cart items for a user
export const getCartItems = async (req, res) => {
  const userId = req.params.userId;

  if (!userId || userId === "undefined") {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const cartItems = await CartItem.find({ user: userId }).populate({
      path: "product",
      select: "name price countInStock uploadedBy images category", // Include category
      populate: [
        {
          path: "uploadedBy",
          select: "username shippingAddress", // select entire shippingAddress
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });
    console.log(cartItems.map((item) => item.product.uploadedBy));

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

// Delete cart items
export const deleteCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  res.status(204).send();
});

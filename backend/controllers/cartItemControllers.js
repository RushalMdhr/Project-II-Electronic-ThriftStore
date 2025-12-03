import asyncHandler from "../middlewares/asyncHandler.js"; 
import CartItem from "../models/cartitemModel.js";
import Product from "../models/productModel.js";

// Add a product to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await CartItem.findOne({
      user: userId,
      product: productId,
    });

    // 🔍 Fetch product to check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existing) {
      const newQty = existing.quantity + (quantity || 1);

      // 🔥 NEW STOCK CHECK ADDED
      if (newQty > product.countInStock) {
        return res.status(400).json({
          message: `Only ${product.countInStock} items in stock. Cannot add more.`,
        });
      }

      existing.quantity = newQty;
      await existing.save();
      return res.status(201).json(existing);
    }

    // 🔥 CHECK STOCK BEFORE CREATING NEW ITEM
    if ((quantity || 1) > product.countInStock) {
      return res.status(400).json({
        message: `Only ${product.countInStock} items in stock.`,
      });
    }

    // Create cart item
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
      select: "name price countInStock uploadedBy images category",
      populate: [
        {
          path: "uploadedBy",
          select: "username shippingAddress",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to get cart items" });
  }
};

// Update quantity (increment/decrement)
export const updateCartItem = asyncHandler(async (req, res) => {
  const { action } = req.body;

  const cartItem = await CartItem.findById(req.params.id).populate("product");
  if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

  if (action === "increment") {
    // 🔥 STOCK CHECK HERE TOO
    if (cartItem.quantity + 1 > cartItem.product.countInStock) {
      return res.status(400).json({
        message: `Only ${cartItem.product.countInStock} items in stock.`,
      });
    }
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

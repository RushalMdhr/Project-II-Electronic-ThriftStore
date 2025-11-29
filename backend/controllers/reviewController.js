import Review from "../models/reviewModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";

// --------------------------------------------------
// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (must have purchased the product)
// --------------------------------------------------
export const createReview = asyncHandler(async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILES:", req.files);

  const { productId, orderId, sellerId, rating, description } = req.body;
  const userId = req.user._id;

  const imagePaths = req.files
    ? req.files.map((file) => `/uploads/reviews/${file.filename}`)
    : [];

  const order = await Order.findOne({ _id: orderId, customer: userId });
  if (!order) {
    return res
      .status(400)
      .json({ message: "Invalid Order or not your order." });
  }

  const existingReview = await Review.findOne({
    user: userId,
    productId,
    orderId,
  });
  if (existingReview) {
    return res
      .status(400)
      .json({ message: "You already reviewed this product." });
  }

  const review = await Review.create({
    user: userId,
    sellerId,
    productId,
    orderId,
    rating,
    description,
    images: imagePaths,
  });

  res.status(201).json({
    message: "Review added successfully.",
    review,
  });
});

// --------------------------------------------------
// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
// --------------------------------------------------
export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId })
    .populate("user", "username avatar")
    .populate("sellerId", "name avatar")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// --------------------------------------------------
// @desc    Get all reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
// --------------------------------------------------
export const getReviewsBySeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const reviews = await Review.find({ sellerId })
    .populate("user", "username avatar")
    .populate("productId", "name images")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// --------------------------------------------------
// @desc    Delete review (Only admin or review owner)
// @route   DELETE /api/reviews/:id
// @access  Private
// --------------------------------------------------
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this review." });
  }

  await review.deleteOne();
  res.json({ message: "Review deleted successfully." });
});

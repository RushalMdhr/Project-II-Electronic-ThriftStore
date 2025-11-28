import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    sellerId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },

    orderId: {
      type: ObjectId,
      ref: "Order",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String, // image URLs or paths
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;

import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }], //{type:String, required : true},
    brand: { type: String, required: true },
    // quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    // reviews : [reviewsSchema],
    condition: {
      type: String,
      required: true,
      enum: ["Excellent condition", "Well-kept", "Clean condition", "Moderately used", "Functional but worn"],
      default: "Excellent condition",
    },
    // numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    discountedPrice: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 1 },
    uploadedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    views: [{ type: String }],
    reported: [
      {
        user: {
          type: ObjectId,
          ref: "User",
        },
        reason: { type: String },
      },
    ],
    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    blackListed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
//today i want something different in product so that many people can see the best item in the shop
//it may not be like but can be view

// ONE TO ONE
// profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }

// ONE TO MANY
// reviews: [reviewsSchema] // Embedded subdocuments (as in your model)
// // or
// reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] // References

// MANY TO ONE
// category: { type: ObjectId, ref: "Category", required: true }

// MANY TO MANY
// In Product
// categories: [{ type: ObjectId, ref: "Category" }]
// // In Category
// products: [{ type: ObjectId, ref: "Product" }]

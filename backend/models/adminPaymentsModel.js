import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const paymentSchema = mongoose.Schema(
  {
    _id: { type: ObjectId, ref: "Order", required: true },
    payments: [
      {
        vendorId: { type: ObjectId, ref: "User", required: true },
        CustomerId: { type: ObjectId, ref: "User", required: true },
        productName: String,
        productPrice: Number,
        quantity: Number,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "esewa"],
      required: true,
      default: "cod",
    },
    shipping: { type: Number, default: 0 },
    orderTotal: Number,
  },
  { timestamps: true }
);

import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        productId : {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        vendorId : {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          // max : instock
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    }
  },
  { timestamps: true }
);

OrderSchema.index({ "items.vendorId": 1 });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
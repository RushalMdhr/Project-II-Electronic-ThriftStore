import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        // vendor: {
        //   type: ObjectId,
        //   ref: "Vendor",
        //   required: true,
        // }, 
        // quantity: {
        //   type: Number,
        //   required: true,
        //   min: 1,
        // },
        // price: {
        //   type: Number,
        //   required: true,
        // },
      },
    ],
  //   shippingAddress: {
  //     address: { type: String, required: true },
  //     city: { type: String, required: true },
  //     postalCode: { type: String, required: true },
  //     country: { type: String, required: true },
  //   },
  //   paymentMethod: {
  //     type: String,
  //     required: true,
  //   },
  //   paymentResult: {
  //     id: { type: String },
  //     status: { type: String },
  //     update_time: { type: String },
  //     email_address: { type: String },
  //   },
  //   totalPrice: {
  //     type: Number,
  //     required: true,
  //   },
  //   isPaid: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   paidAt: {
  //     type: Date,
  //   },
  //   isDelivered: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   deliveredAt: {
  //     type: Date,
  //   },
  total_price:{
    type: Number,
    required: true,
    default: 0,
  }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

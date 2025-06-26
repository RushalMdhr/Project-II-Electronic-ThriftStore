// const mongoose = require("mongoose"); 
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
      quantity: { type: Number, required: true, default: 1 }, 
    },
  ],

  totalAmount: { type: Number, required: true }, 
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "cancelled"],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, 

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true }, 
  },
});

const Order = mongoose.model("Order", orderSchema,'orders');

export default Order;

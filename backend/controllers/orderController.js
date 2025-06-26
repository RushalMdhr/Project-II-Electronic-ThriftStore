// const Order = require("../models/Order");
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

// 👉 Create a new order
export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// 👉 Get all orders
export const getAllOrders = async (req, res) =>  {
  try {
    const orders = await Order.find().populate("user").populate("items.productId");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// 👉 Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user").populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

// 👉 Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

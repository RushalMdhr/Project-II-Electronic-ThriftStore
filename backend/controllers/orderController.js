import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.time('createOrder')

  const { orderItems } = req.body;
  console.log(orderItems)

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }

  try {
    const validatedItems = await Promise.all(orderItems.map(async (items) => {
      const productDoc = await Product.findById(items.productId)
      if (!productDoc) {
        throw new Error("Product not found");
      }
      if (productDoc.countInStock < items.quantity) {
        throw new Error(`Not enough stock for ${productDoc.name}`);
      }
      return {
        // ...items,
        product: productDoc._id,
        vendor: productDoc.uploadedBy,
        quantity: items.quantity,
        // product: ObjectId(items.productId),
        // vendor: ObjectId(items.vendor),
        // quantity: items.quantity,

        price: productDoc.price,
      }
    }))
    console.log(validatedItems)

    const newOrder = new Order({
      customer: req.user._id,
      orderItems: validatedItems,
    });
    console.log("new now 2", newOrder);

    const orderCreated = await newOrder.save();
    console.timeEnd('createOrder')

    res.status(201).json(orderCreated);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Server error creating order" });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate({
      path: 'orderItems.product',
      model: 'Product',
    });

  console.log(`Found ${orders.length} orders for user ${req.user._id}`); // DEBUG
  console.log(orders.orderItems);

  res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "email");

  console.log(`Found ${orders.length} total orders (admin)`); // DEBUG

  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "email");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getSoldOrders = asyncHandler(async (req, res) => {
  console.time("getSoldOrders");
  try {
    const vendorObjectId = req.user._id

    const Ordered = await Order.aggregate([
      // Step 1: match only orders that include this vendor
      { $match: { "orderItems.vendor": vendorObjectId } },

      // Step 2: project only customer + filtered vendor items
      {
        $project: {
          customer: 1,
          orderItems: {
            $filter: {
              input: "$orderItems",
              as: "item",
              cond: { $eq: ["$$item.vendor", vendorObjectId] }
            }
          }
        }
      }
    ]);
    console.timeEnd("getSoldOrders");


    res.status(200).json(Ordered);
  } catch (error) {
    console.error("Error fetching sold orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getSoldOrders
};

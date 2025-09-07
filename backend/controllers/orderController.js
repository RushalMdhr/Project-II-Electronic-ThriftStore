import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.log("hello world from buy")
  const { orderItems } = req.body;
  console.log(orderItems);
  try {

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
    // Calculate total price by fetching each product's price and multiplying by quantity
    const itemsPrice = (
      await Promise.all(
        orderItems.map(async (item) => {
          console.log("mappin")
          const productDoc = await Product.findById(item.productId);
          if (!productDoc){
            console.error("product not found")
          }
          if(productDoc.countInStock<item.quantity){
            console.log("quantity above stock")
            return res.send({error : "quantity above stock"})
          }
          return productDoc.price * item.quantity;
        })
      )
    ).reduce((acc, price) => acc + price, 0);
console.log('working')
    console.log('Total items price:', itemsPrice,);
    console.log(itemsPrice)

    const newOrder = new Order({ customer: req.user._id, orderItems, total_price: itemsPrice })
    // console.log("creating order : ", newOrder);
    const orderCreated = await newOrder.save();
    console.log("orderCreated : ", orderCreated);
    res.send(orderCreated)
  } catch (error) {
    console.log('error', error)
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer : req.user._id })
    .populate({
      path: 'orderItems.productId',
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

console.time("getSoldOrders");
const getSoldOrders = asyncHandler(async (req, res) => {
  try {
    const vendorObjectId = new mongoose.Types.ObjectId(req.user.id);

    const Ordered = await Order.aggregate([
      // Step 1: match only orders that include this vendor
      { $match: { "orderItems.vendorId": vendorObjectId } },

      // Step 2: project only customer + filtered vendor items
      {
        $project: {
          customer: 1,
          orderItems: {
            $filter: {
              input: "$orderItems",
              as: "item",
              cond: { $eq: ["$$item.vendorId", vendorObjectId] }
            }
          }
        }
      }
    ]);

    res.status(200).json(Ordered);
  } catch (error) {
    console.error("Error fetching sold orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
console.timeEnd("getSoldOrders");

export {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getSoldOrders
};

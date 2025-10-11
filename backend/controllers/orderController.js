import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { Transaction } from "../models/esewaModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.time("createOrder");

  const { orderItems, method, paymentId } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }

  try {
    let status;

    if (!["cod", "esewa"].includes(method)) {
      return res.status(400).send("invalid method");
    }
    if (method == "esewa") {
      const esewaPayment = await Transaction.findOne({ ProductId: paymentId });
      if (!esewaPayment)
        return res.status(404).send({ message: "esewa payment not found !" });
      switch (esewaPayment.status) {
        case "COMPLETE":
          status = "paid";
          break;

        case "PENDING":
          return res.status(400).json({
            error: "Payment still processing. Please wait or try again.",
          });

        case "FAILED":
          return res.status(400).json({
            error: "Payment failed. Please try again.",
          });

        case "REFUNDED":
          return res.status(400).json({
            error: "Payment was refunded. Cannot create order.",
          });

        default:
          return res.status(400).json({ error: "Unknown payment status" });
      }
    }
    const validatedItems = await Promise.all(
      orderItems.map(async (items) => {
        const productDoc = await Product.findById(items.productId);
        if (!productDoc) {
          throw new Error("Product not found");
        }
        if (productDoc.countInStock < items.quantity) {
          throw new Error(`Not enough stock for ${productDoc.name}`);
        }
        return {
          product: productDoc._id,
          vendor: productDoc.uploadedBy,
          quantity: items.quantity,
          price: productDoc.price,
        };
      })
    );

    const newOrder = new Order({
      customer: req.user._id,
      orderItems: validatedItems,
      payment: {
        method: method,
        status: status,
      },
    });

    const orderCreated = await newOrder.save();

    console.timeEnd("createOrder");

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
  const orders = await Order.find({ customer: req.user._id }).populate({
    path: "orderItems.product",
    model: "Product",
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

const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const { status } = req.body;
    if (
      ![
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ].includes(status) |
      (order.status === status)
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }
    order.status = status;
    order.save();
    res.send(order);
  } catch (error) {
    res.status(500).send("error", error);
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
    const vendorObjectId = req.user._id;

    const Ordered = await Order.aggregate([
      // Step 1: Match orders that contain this vendor
      { $match: { "orderItems.vendor": vendorObjectId } },

      // Step 2: Filter only vendor’s items
      {
        $addFields: {
          orderItems: {
            $filter: {
              input: "$orderItems",
              as: "item",
              cond: { $eq: ["$$item.vendor", vendorObjectId] },
            },
          },
        },
      },

      // Step 3: Lookup customer details
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },

      // Step 4: Lookup products (all at once)
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Step 5: Map each orderItem with its matching product
      {
        $addFields: {
          orderItems: {
            $map: {
              input: "$orderItems",
              as: "item",
              in: {
                quantity: "$$item.quantity",
                price: "$$item.price",
                vendor: "$$item.vendor",
                product: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$productDetails",
                        as: "prod",
                        cond: { $eq: ["$$prod._id", "$$item.product"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },

      // Step 6: Clean final projection
      {
        $project: {
          _id: 1,
          customer: {
            $arrayElemAt: ["$customerDetails.username", 0],
          },
          customerEmail: {
            $arrayElemAt: ["$customerDetails.email", 0],
          },
          subtotal: 1,
          shipping: 1,
          tax: 1,
          total: 1,
          status: 1,
          payment: 1,
          createdAt: 1,
          orderItems: {
            quantity: 1,
            price: 1,
            vendor: 1,
            "product.name": 1,
            "product.images": 1,
          },
        },
      },
    ]);

    res.send(Ordered);

    console.timeEnd("getSoldOrders");
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
  updateOrderStatus,
  updateOrderToDelivered,
  getSoldOrders,
};

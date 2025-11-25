import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { Transaction } from "../models/esewaModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.time("createOrder");
  const { orderItems, method, address } = req.body;
  console.log("as u can see", req.body);
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }

  try {
    const validatedItems = await Promise.all(
      orderItems.map(async (items) => {
        const productDoc = await Product.findById(items.productId);
        if (!productDoc) {
          // throw new Error("Product not found");
          return res.status(404).send("Product not found");
        }
        if (productDoc.countInStock < items.quantity) {
          // throw new Error(`Not enough stock for ${productDoc.name}`);
          return res
            .status(401)
            .send(`Not enough stock for ${productDoc.name}`);
        }
        productDoc.sold = true;
        await productDoc.save();
        return {
          product: productDoc._id,
          vendor: productDoc.uploadedBy,
          quantity: items.quantity,
          price: productDoc.price,
        };
      })
    ); // Calculate subtotal
    const subTotal = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate tax
    const tax = subTotal * 0.13;

    // Calculate total shipping (sum of all vendor shipping charges or default)
    const shipping = req.body.shipping || 100; // or calculate from vendorGroups if passed

    // Total
    const total = subTotal + tax + shipping;

    const newOrder = new Order({
      customer: req.user._id,
      orderItems: validatedItems,
      payment: {
        method: method,
      },
      shippingAddress: {
        city: address.city,
        street: address.street,
      },
      shipping, // include shipping
      tax, // include tax
      total, // include total
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    console.log("new order : ", newOrder);
    await newOrder.save();

    console.timeEnd("createOrder");

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Server error creating order" });
  }
});

// const createOrder = asyncHandler(async (req, res) => {
//   console.time("createOrder");
//   const { orderItems, method } = req.body;

//   if (!orderItems || orderItems.length === 0) {
//     return res.status(400).json({ error: "No order items" });
//   }

//   try {
//     // 1. Get all products in single query
//     const products = await Product.find({
//       _id: { $in: orderItems.map((item) => item.productId) },
//     });

//     // 2. Validate stock and create lookup map
//     const productMap = {};
//     const outOfStockItems = [];

//     products.forEach((product) => {
//       productMap[product._id.toString()] = product;

//       const orderItem = orderItems.find(
//         (item) => item.productId.toString() === product._id.toString()
//       );

//       if (product.countInStock < orderItem.quantity) {
//         outOfStockItems.push(product.name);
//       }
//     });

//     // 3. Check for missing products or insufficient stock
//     const missingProducts = orderItems.filter(
//       (item) => !productMap[item.productId.toString()]
//     );

//     if (missingProducts.length > 0) {
//       throw new Error("Some products not found");
//     }

//     if (outOfStockItems.length > 0) {
//       throw new Error(`Not enough stock for: ${outOfStockItems.join(", ")}`);
//     }

//     // 4. Update all products in single bulk operation
//     await Product.bulkWrite(
//       orderItems.map((item) => ({
//         updateOne: {
//           filter: { _id: item.productId },
//           update: {
//             $inc: { countInStock: -item.quantity },
//             // $set: { $eq: [{ $subtract: ["$countInStock", item.quantity] }, -1] },
//           },
//         },
//       }))
//     );

//     // 5. Create validated items
//     const validatedItems = orderItems.map((item) => ({
//       product: item.productId,
//       vendor: productMap[item.productId.toString()].uploadedBy,
//       quantity: item.quantity,
//       price: productMap[item.productId.toString()].price,
//     }));

//     // 6. Create order
//     const newOrder = new Order({
//       customer: req.user._id,
//       orderItems: validatedItems,
//       payment: { method: method },
//     });

//     const orderCreated = await newOrder.save();
//     console.timeEnd("createOrder");

//     res.status(201).json(orderCreated);
//   } catch (error) {
//     console.error("Order creation failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // const orders = await Order.find({ customer: req.user._id }).populate({
  //   path: "orderItems.product",
  //   model: "Product",
  // });

  const customerObjectId = req.user._id;
  const orders = await Order.aggregate([
    { $match: { customer: customerObjectId } },

    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    {
      $addFields: {
        orderItems: {
          $map: {
            input: "$orderItems",
            as: "item",
            in: {
              _id: "$$item._id",
              quantity: "$$item.quantity",
              price: "$$item.price",
              status: "$$item.status",
              reasonForCancel: "$$item.reasonForCancel",
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
        subtotal: 1,
        shipping: 1,
        tax: 1,
        total: 1,
        status: 1,
        payment: 1,
        createdAt: 1,
        orderItems: {
          _id: 1,
          status: 1,
          quantity: 1,
          price: 1,
          "product.name": 1,
          "product._id": 1,
          reasonForCancel: 1,
        },
      },
    },
  ]);

  console.log(`Found ${orders.length} orders for user ${req.user._id}`); // DEBUG
  console.log(orders.orderItems);

  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const { OrderId } = req.params;
  console.log("order Id : ", OrderId.toString());
  const order = await Order.findById(OrderId).populate(
    "customer",
    "username email"
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  console.log("order : ", order._id);
  res.json({
    order: {
      payment: order.payment,
      customer: order.customer,
      total: order.total,
      status: order.status,
      date: order.createdAt, //only those things that a delivery guy need no unnecessary
    },
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  console.log("i m here : ", req.body.method);
  const { method } = req.body;
  try {
    if (method === "esewa") {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Order Id is required" });
      }
      const esewaPayment = await Transaction.findOne({ product_id: id });
      if (!esewaPayment)
        return res.status(404).send({ message: "esewa payment not found !" });
      console.log("esewa payment found : ", esewaPayment);
      const order = await Order.findById(id);
      if (!order) return res.status(404).send({ message: "order not found !" });

      switch (esewaPayment.status) {
        case "COMPLETE":
          esewaPayment.amount = order.total;
          console.log("complete payment");
          order.payment.status = "paid";
          await order.save();
          return res.status(200).json({ message: "Order paid successfully" });

        case "FAILED":
          console.log("failed payment");
          return res.status(400).json({
            error: "Payment failed. Please try again.",
          });

        case "REFUNDED":
          console.log("refunded payment");
          return res.status(400).json({
            error: "Payment was refunded. Cannot update order.",
          });
        default:
          return res.status(400).json({ error: "Unknown payment status" });
      }
    } else if (method === "cod") {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).send({ message: "order not found !" });
      res.status(200).json({ message: "Cash on Delivery selected" });
    }
  } catch (error) {}
});

// @desc    Update order status by vendor
// @route   PATCH /api/orders/update-vendororder-status
// @access  Private/Vendor
const updateVendorOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, items } = req.body;
    console.log("Received update:", req.body);

    if (!orderId || !items) {
      return res
        .status(400)
        .json({ message: "Order ID and items are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update each order item status
    order.orderItems?.forEach((orderItem) => {
      const matchingItem = items.find(
        (item) => item.id === orderItem._id.toString()
      );

      //just to confirm or reject each orderItems
      if (matchingItem) {
        if (matchingItem.confirmed) {
          orderItem.status = "confirmed";
        } else {
          orderItem.status = "cancelled";
          orderItem.reasonForCancel = matchingItem.reason;
        }
      }
    });

    // Check if all items have been actioned
    const allActioned = order.orderItems.every(
      (item) => item.status !== "pending"
    );

    if (allActioned) {
      const allConfirmed = order.orderItems.every(
        (item) => item.status === "confirmed"
      );

      if (allConfirmed) {
        try {
          // Check stock and deduct for CONFIRMED items only
          for (let item of order.orderItems) {
            if (item.status === "confirmed") {
              const product = await Product.findById(item.product);
              if (!product) {
                throw new Error(`Product ${item.product} not found`);
              }
              if (product.countInStock < item.quantity) {
                throw new Error(
                  `Not enough stock for ${product.name}. Available: ${product.countInStock}, Requested: ${item.quantity}`
                );
              }

              // Deduct stock
              product.countInStock -= item.quantity;
              if (product.countInStock === 0) {
                product.sold = true;
              }
              await product.save();
            }
          }

          // Update order status
          order.status = "confirmed";
          order.expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 10 minutes
        } catch (error) {
          // If stock check fails, revert item statuses to pending
          order.orderItems.forEach((item) => {
            if (item.status === "confirmed") {
              item.status = "pending";
            }
          });
          await order.save();
          return res.status(400).json({
            message: "Order confirmation failed",
            error: error.message,
          });
        }
      } else if (order.payment.method === "esewa") {
        // If any item cancelled and payment was eSewa, refund
        order.status = "refunded";
      } else {
        // If COD and some items cancelled
        order.status = "pending";
      }
    }

    await order.save();
    console.log("Order updated successfully");
    res.json({
      message: "Order updated successfully",
      order,
      status: order.status,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = "delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      status: updatedOrder.status,
      deliveredAt: updatedOrder.deliveredAt,
    });
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
                _id: "$$item._id",
                quantity: "$$item.quantity",
                price: "$$item.price",
                status: "$$item.status",
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
          // subtotal: 1,
          // shipping: 1,
          // tax: 1,
          // total: 1,
          status: 1,
          payment: 1,
          createdAt: 1,
          orderItems: {
            _id: 1,
            status: 1,
            quantity: 1,
            price: 1,
            "product.name": 1,
            "product._id": 1,
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

//regularly checking if theres any error orders or confirmed one
const deleteErrorOrder = asyncHandler(async (req, res) => {
  console.log("deleting the broken orders");
  // 2. Then delete
  // const orderEsewaPending =
  await Order.deleteMany({
    "payment.method": "esewa",
    "payment.status": "pending",
    expiresAt: { $lt: new Date() },
  });
  // if (!orderEsewaPending) {
  //   console.log("sorry orderEsewa not found");
  // } else {
  //   console.log("Deleted:", orderEsewaPending.deletedCount);
  // }

  await Order.updateMany(
    {
      status: "confirmed",
      expiresAt: { $lt: new Date() },
    },
    {
      $set: { status: "processing" }, // ✅ Add this - what to update
    }
  );

  await Order.updateMany(
    {
      status: "shipped",
      // expiresAt: { $lt: new Date() },
    },
    {
      $set: { status: "delivered" }, // ✅ Add this - what to update
    }
  );
});

const getOrder = asyncHandler(async (req, res) => {
  const {
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 10,
  } = req.query;

  // Build filter object
  const filter = {};

  // Status filter
  if (status && status !== "all") {
    switch (status) {
      case "active":
        // All active orders (confirmed + processing are same)
        filter.status = {
          $in: ["pending", "confirmed", "processing", "shipped"],
        };
        break;
      case "in_progress":
        // Confirmed + Processing (grouped together)
        filter.status = { $in: ["confirmed", "processing"] };
        break;
      case "pending":
        filter.status = "pending";
        break;
      case "shipped":
        filter.status = "shipped";
        break;
      case "delivered":
        filter.status = "delivered";
        break;
      case "cancelled":
        filter.status = { $in: ["cancelled", "refunded"] };
        break;
      default:
        filter.status = status;
    }
  }

  // Payment status filter
  if (paymentStatus && paymentStatus !== "all") {
    filter["payment.status"] = paymentStatus;
  }

  // Date range filter
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const orders = await Order.find(filter)
    .populate("customer", "username email")
    .populate("orderItems.product", "name images")
    .limit(parseInt(pageSize))
    .skip(parseInt(pageSize) * (parseInt(page) - 1))
    .select("-__v -orderItems.vendor")
    .sort({ createdAt: -1 }) // Newest first
    .lean();

  const totalOrders = await Order.countDocuments(filter);

  res.json({
    orders,
    totalPages: Math.ceil(totalOrders / pageSize),
    currentPage: parseInt(page),
    totalOrders,
  });
});
const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { orderId, action } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).send("order not found !!");
  }
  order.status = action;
  order.save();
  res.send({ "order status updated to : ": order.status });
  // res.send("updating...")
});

export {
  getOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateVendorOrderStatus,
  updateOrderToDelivered,
  getSoldOrders,
  deleteErrorOrder,
  updateAdminOrderStatus,
};

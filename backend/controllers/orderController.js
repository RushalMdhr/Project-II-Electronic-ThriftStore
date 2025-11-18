import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { Transaction } from "../models/esewaModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.time("createOrder");
  const { orderItems, method } = req.body;
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
    );
    const newOrder = new Order({
      customer: req.user._id,
      orderItems: validatedItems,
      payment: {
        method: method,
      },
    });

    console.log("new order : ", newOrder);
    const orderCreated = await newOrder.save();

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
  const order = await Order.findById(req.params.orderId).populate(
    "user",
    "email"
  );

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

const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    console.log("updating status ....");
    console.log("getting status ....", req.body);
    console.log("fetching id ...", req.params.orderId);
    const { status } = req.body;
    if (
      ![
        "pending",
        "confirmed",
        "processing",
        "shipped",
        // "delivered",
        "cancelled",
        // "refunded",
      ].includes(status) |
      (order.status === status)
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send("order not found");
    console.log(order);
    switch (status) {
      case "confirmed":
        Promise.all(
          order.orderItems.map(async (orderItem) => {
            const product = await Product.findById(orderItem.product);
            if (product) {
              product.countInStock -= 1;
              console.log(product.countInStock);
              product.save();
            } else {
              return res.status(404).send("product not found");
            }
          })
        );
        break;

      // case "processing"
    }
    order.status = status;
    order.save();
    res
      .status(200)
      .send({ message: `order ${order._id} status updated to ${status}` });
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
                quantity: "$$item.quantity",
                price: "$$item.price",
                // vendor: "$$item.vendor",
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
            "product._id": 1,
            // "product.images": 1,
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

const deleteErrorOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (orderId) {
    const order = await Order.findOneAndDelete({ _id: orderId });
    if (order) {
      res.status(200).send({ message: "order deleted", order_id: order._id });
    } else {
      return res.status(404).send("order not found");
    }
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
  deleteErrorOrder,
};

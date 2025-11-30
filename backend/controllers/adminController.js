// controllers/adminController.js
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const getAdminSummary = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const vendors = await User.countDocuments({ isVendor: true });
    const products = await Product.countDocuments();

    const orders = await Order.find().populate("customer", "email").lean();
    
    // Calculate total revenue from adminRevenue field
    const revenue = orders.reduce(
      (acc, order) => acc + (order.adminRevenue ?? 0), // Use adminRevenue instead of totalPrice
      0
    );

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $type: "date" }, // ✅ only include valid dates
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$adminRevenue" }, // Sum adminRevenue instead of totalPrice
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $type: "date" }, // ✅ only include valid dates
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      users,
      vendors,
      products,
      revenue,
      orders: orders.length, // Send count instead of all orders
      salesData,
      userGrowthData,
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    res.status(500).json({
      message: "Admin summary failed",
      error: error.message,
    });
  }
};
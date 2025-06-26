// controllers/adminController.js
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const getAdminSummary = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const vendors = await User.countDocuments({ isVendor: true });
    const products = await Product.countDocuments();
    const orders = await Order.find().populate("user", "email");

    const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      users,
      vendors,
      products,
      revenue,
      orders,
      salesData,
    });
  } catch (error) {
    res.status(500).json({ message: "Admin summary failed", error });
  }
};

// Controller to get user growth data grouped by day (last 30 days)
export const getUserGrowth = async (req, res) => {
    try {
      // Aggregate users by createdAt date (format YYYY-MM-DD)
      const userGrowthData = await User.aggregate([
        {
          $match: {
            createdAt: {
              // Only last 30 days
              $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 }, // Count users per day
          },
        },
        { $sort: { _id: 1 } }, // Sort by date ascending
      ]);
  
      res.json(userGrowthData);
    } catch (error) {
      console.error("Error in getUserGrowth:", error);
      res.status(500).json({ message: "Server error while getting user growth" });
    }
  };

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

    // Add userGrowthData aggregation here:
    const userGrowthData = await User.aggregate([
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
      orders,
      salesData,
      userGrowthData, // <-- Include it here
    });
  } catch (error) {
    res.status(500).json({ message: "Admin summary failed", error });
  }
};
  
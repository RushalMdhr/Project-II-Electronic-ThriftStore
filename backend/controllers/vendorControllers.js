import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Category from "../models/categoryModel.js";

// Get main dashboard stats
export const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Count vendor's products
    const productsCount = await Product.countDocuments({
      uploadedBy: vendorId,
    });

    // Get orders that include this vendor
    const orders = await Order.find({ "orderItems.vendor": vendorId });

    // Total orders and revenue
    let totalRevenue = 0;
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.vendor.toString() === vendorId.toString()) {
          totalRevenue += item.price * item.quantity;
        }
      });
    });
    const totalOrders = orders.length;

    res.json({ productsCount, totalOrders, revenue: totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Sales growth per month
export const getSalesGrowth = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ "orderItems.vendor": vendorId });

    const monthlyRevenue = {}; // key: month, value: revenue

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.vendor.toString() === vendorId.toString()) {
          const month = order.createdAt.getMonth(); // 0-11
          monthlyRevenue[month] =
            (monthlyRevenue[month] || 0) + item.price * item.quantity;
        }
      });
    });

    const labels = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
    const data = Array.from({ length: 12 }, (_, i) => monthlyRevenue[i] || 0);

    res.json({ labels, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Category distribution of vendor's products
export const getCategoryRange = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const products = await Product.find({ uploadedBy: vendorId }).populate(
      "category"
    );

    const categoryCount = {};
    products.forEach((product) => {
      const categoryName = product.category?.name || "Uncategorized";
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);

    res.json({ labels, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Recent orders (last 5)
export const getRecentOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ "orderItems.vendor": vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "username email");

    // Only include items relevant to this vendor
    const vendorOrders = orders.map((order) => ({
      _id: order._id,
      customer: order.customer,
      createdAt: order.createdAt,
      total: order.orderItems
        .filter((item) => item.vendor.toString() === vendorId.toString())
        .reduce((acc, item) => acc + item.price * item.quantity, 0),
    }));

    res.json(vendorOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const vendor = await User.findById(vendorId).select(
      "-password" // exclude password
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

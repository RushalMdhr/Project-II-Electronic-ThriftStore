// controllers/adminController.js
import User, { Admin } from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getAdminSummary = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const vendors = await User.countDocuments({ isVendor: true });
    const products = await Product.countDocuments();

    const orders = await Order.find().populate("user", "email").lean();
    const revenue = orders.reduce(
      (acc, order) => acc + (order.totalPrice ?? 0),
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
          total: { $sum: "$totalPrice" },
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
      orders,
      salesData,
      userGrowthData,
    });
  } catch (error) {
    console.error("Admin summary error:", error );
    res.status(500).json({
      message: "Admin summary failed",
      error: error.message,
    });
  }
};

const becomeAdmin = asyncHandler(async (req, res) => {
  const exists = await Admin.findOne().select('_id').lean();
  const userId = req.user._id
  const user = await User.findById(userId)
  if(user){
    console.log('user : ',user)
  }
  let permissions, accessLevel
  try {
    if (!exists) {
      user.isAdmin = true
      permissions = ["manage_users", "view_reports", "manage_products", "handle_refunds", "view_cashflow"]
      accessLevel = "super_admin"
      const admin = new Admin({
        userId,
        permissions,
        accessLevel,
      }) 
      console.log(admin)
    }
    else{
      notifica
    }

   
  } catch (error) {

  }
})

export {
  getAdminSummary,
  becomeAdmin
}

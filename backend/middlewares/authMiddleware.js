import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// Authenticate user from JWT token stored in cookies
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("User not found.");
      }

      // ✅ Banned user check
      if (user.status === "banned") {
        res.clearCookie("jwt"); // important
        res
          .status(403)
          .json({ message: "Access denied. Your account has been banned." });
        return;
      }


      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

//Just check if user is authenticated
const isAuthenticated = asyncHandler(async (req, res, next) => {

  const token = req.cookies.jwt;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    req.user = user; 
    console.log(req.user)
    next();
  }
  else {
    next();
  }
})

// Check if user is an admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Not authorized as an admin");
  }
};

// Check if user is a vendor
const authorizeVendor = (req, res, next) => {
  if (req.user && req.user.isVendor) {
    next();
  } else {
    res.status(403).send("Not authorized as a vendor");
  }
};

// Check if user is admin or vendor
const authorizeAdminOrVendor = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.isVendor)) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin or vendor" });
  }
};

export {
  authenticate,
  authorizeAdmin,
  authorizeVendor,
  authorizeAdminOrVendor,
  isAuthenticated,
};

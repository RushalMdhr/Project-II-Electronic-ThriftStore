import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";
import mongoose from "mongoose";

const SECRET_KEY = "bgtery";
// salt is random

const createUser = asyncHandler(async (req, res) => {
  console.log("req.body:", req.body); // Debug log to see incoming data
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("please fill all the ip");
  }

  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400).send("user already exits");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isVendor: newUser.isVendor,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const exitingUser = await User.findOne({ email });

    if (!exitingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block banned users
    if (exitingUser.status === "banned") {
      return res.status(403).json({ message: "Account is banned by admin." });
    }

    const INACTIVITY_LIMIT_MINUTES = 1440; // 24 hours

    const lastLogin = exitingUser.lastLogin || exitingUser.createdAt;
    const inactivityThreshold = new Date(
      Date.now() - INACTIVITY_LIMIT_MINUTES * 60 * 1000
    );

    if (lastLogin < inactivityThreshold && exitingUser.status === "active") {
      exitingUser.status = "inactive";
      await exitingUser.save();
      return res.status(403).json({
        message: `Account set to inactive due to ${
          INACTIVITY_LIMIT_MINUTES / 60
        } hours of inactivity. Log in again to reactivate.`,
      });
    }
    

    const isPasswordValid = await bcrypt.compare(
      password,
      exitingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Auto-reactivate user on successful login
    exitingUser.lastLogin = new Date();
    if (exitingUser.status === "inactive") {
      exitingUser.status = "active";
    }
    await exitingUser.save();

    createToken(res, exitingUser._id);

    res.status(200).json({
      _id: exitingUser._id,
      username: exitingUser.username,
      email: exitingUser.email,
      isAdmin: exitingUser.isAdmin,
      isVendor: exitingUser.isVendor,
      shopName: exitingUser.shopName,
      shopDescription: exitingUser.shopDescription,
      status: exitingUser.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// const uploadFile = (req, res) => {
//   res.status(200).json({ filePath: req.file.path });
// };

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Request to delete user ID:", id); // Debug log

    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    console.log("User deleted successfully");
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin ?? user.isAdmin;
  user.isVendor = req.body.isVendor ?? user.isVendor;
  user.isUser = req.body.isUser ?? user.isUser;

  // Only allow admin to change status to "banned" or back to "active"
  if (req.body.status && ["banned", "active"].includes(req.body.status)) {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin can ban or unban users" });
    }
    user.status = req.body.status;
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    isVendor: updatedUser.isVendor,
    isUser: updatedUser.isUser,
    status: updatedUser.status,
  });
});



const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      console.log("theres is password : ", req.body.password);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log("new password : ", hashedPassword);
      user.password = hashedPassword;
    } else {
      console.log("theres no password : ", req.body.password);
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      isVendor: updateUser.isVendor,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// Create or update vendor shop details and set isVendor to true
const updateVendorShop = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { shopName, shopDescription } = req.body;
  if (!shopName || !shopDescription) {
    return res.status(400).json({ message: "Shop name and description are required" });
  }
  user.shopName = shopName;
  user.shopDescription = shopDescription;
  user.isVendor = true;
  await user.save();
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isVendor: user.isVendor,
    shopName: user.shopName,
    shopDescription: user.shopDescription,
  });
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVendor: user.isVendor,
      shopName: user.shopName,
      shopDescription: user.shopDescription,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

export { createUser, loginUser, logout, getAllUsers,deleteUser,updateCurrentUserProfile, updateVendorShop, getCurrentUserProfile };

import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";

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

    if (exitingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        exitingUser.password
      );

      if (isPasswordValid) {
        createToken(res, exitingUser._id);

        res.status(201).json({
          _id: exitingUser._id,
          username: exitingUser.username,
          email: exitingUser.email,
          isAdmin: exitingUser.isAdmin,
        });
        return;
      } else {
        res.status(401).json({ message: "Incorrect password" });
        return;
      }
    }else{
      res.status(404).json({ message : "User not found "})

    }
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
export { createUser, loginUser, logout, getAllUsers,deleteUser,updateCurrentUserProfile };

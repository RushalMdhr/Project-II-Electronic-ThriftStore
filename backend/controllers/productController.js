import Product from "../models/productModel.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const mappedProducts = products.map((product) => ({
      ...product.toObject(),
      id: product._id.toString(),
    }));
    res.json(mappedProducts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected");
    }

    const { id } = req.params;

    // Since _id is string, no need for ObjectId validation, but you can still check length
    if (typeof id !== "string" || id.length === 0) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const existingDoc = await Product.findOne({ _id: id }).lean();
    if (!existingDoc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const result = await Product.findOneAndDelete({ _id: id });

    if (!result) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(204).end();
  } catch (err) {
    console.error("DELETE Operation Failed:", err);
    return res.status(500).json({ error: "Delete operation failed" });
  }
};
  
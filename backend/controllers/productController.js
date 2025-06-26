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
    console.log("🗑️ Delete request received for product ID:", id);

    if (typeof id !== "string" || id.length === 0) {
      console.warn("⚠️ Invalid ID format:", id);
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const existingDoc = await Product.findOne({ _id: id }).lean();
    if (!existingDoc) {
      console.warn("⚠️ No product found with ID:", id);
      return res.status(404).json({ error: "Document not found" });
    }

    console.log("✅ Found product:", existingDoc.name);

    const result = await Product.findOneAndDelete({ _id: id });

    if (!result) {
      console.error("❌ Deletion failed, no result returned");
      return res.status(404).json({ error: "Document not found" });
    }

    console.log("🗑️ Product deleted successfully:", result.name);

    return res.status(204).end();
  } catch (err) {
    console.error("❌ DELETE Operation Failed:", err);
    return res.status(500).json({ error: "Delete operation failed" });
  }
};


export const createProducts= async (req, res) => {
  try {
    const { name, price, description } = req.body;
    console.log("FILES RECEIVED:", req.files);  // ✅ this should now show an array
    console.log("BODY:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const imageFile = req.files[0];
    const newProduct = new Product({
        name: req.body.name,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        category: req.body.category,
        description: req.body.description,
        image: imageFile.filename,  //save filename in DB to refer later
    }); 

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
    console.log(" Created product:", savedProduct);
    
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message || error.toString(),
    });
  }
};

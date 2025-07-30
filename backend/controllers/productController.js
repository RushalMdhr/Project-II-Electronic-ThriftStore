import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";

const createProduct = asyncHandler(async (req, res) => {
  try {
    // const images = Array.isArray(JSON.parse(req.fields["images"]))
    //   ? req.fields["images[]"]
    //   : [req.fields["images[]"]];

    const images = JSON.parse(req.fields["images"] || "[]");  
    console.log("images ; ",images)
    const { name, description, price, category, quantity, brand } = req.fields;
    switch (true) {
      case !name:
        return res.json({ error: "name is required" });
      case !brand:
        return res.json({ error: "brand is required" });
      case !description:
        return res.json({ error: "description is required" });
      case !price:
        return res.json({ error: "price is required" });
      case !category:
        return res.json({ error: "category is required" });
    }

    const product = new Product({
      ...req.fields,
      images,
      uploadedBy: req.user._id
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate("uploadedBy", "name") // populate vendor name here
      .limit(12)
      .sort({ createdAt: -1 });

    const mappedProducts = products.map((product) => ({
      ...product.toObject(),
      id: product._id.toString(),
    }));
    res.json(mappedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    //validation
    switch (true) {
      case !name:
        return res.json({ error: "name is required" });
      case !brand:
        return res.json({ error: "brand is required" });
      case !description:
        return res.json({ error: "description is required" });
      case !price:
        return res.json({ error: "price is required" });
      case !category:
        return res.json({ error: "category is required" });
    }

    const product = await Product.findById(
      req.params.productId,
      { ...req.fields },
      { new: true }
    );
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const deleteProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (product && product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        // Adjust the path as per your upload directory
        const uploadsDir = path.join(process.cwd(), "uploads");
        const filePath = path.join(
          uploadsDir,
          path.basename(imgPath)
        );
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete image:", filePath, err);
        });
      });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    console.log(req.query.productId ? "product filter need" : "product filter no need")
    const pageSize = req.query.productId ? 2 : 4;
    console.log(pageSize)
    const page = Number(req.query.page) || 1;


    // Search keyword
    let dbFilter = {};

    if (req.query.productId) {
      dbFilter._id = { $ne: req.query.productId }
    }
    // Only add search if keyword is present and not empty
    if (req.query.keyword !== "null" && typeof req.query.keyword === String && req.query.keyword.trim().length > 0) {
      dbFilter.name = { $regex: req.query.keyword, $options: "i" };
    }

    // Exclude own products only if logged in as vendor
    if (req.user !== null && req.user.isVendor) {
      dbFilter.uploadedBy = { $ne: req.user._id };
    }

    const count = await Product.countDocuments(dbFilter);
    const products = await Product.find(dbFilter)
      .populate("uploadedBy", "name") // <-- Populate vendor name here
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // const transformedProducts = products.map(p=>({
    //   ...p.toObject(),
    //   views : p.views ? p.views.length : 0,
    // }));

    res.json({
      count,
      // transformedProducts,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
    });

  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});


const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate("category", "name")
      .populate("uploadedBy", "name");
    // .populate("user", "username email");

    if (product) {
      return res.json(product);
    } else {
      res.status(400);
      throw new Error("product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "review added" });
    } else {
      res.status(404);
      throw new Error("product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ updatedAt: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const getMyProducts = asyncHandler(async (req, res) => {
  try {
    
    const id = req.user._id;
    
    console.log(id)
    // const myProducts = await Product.UploadedBy.find({  id})
    const myProducts = await Product.find({ uploadedBy: id }).populate(
      "category"
    );
    // .populate('category', 'name');
    res.send(myProducts);
    console.log("getting your products");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const increaseViewCount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user && req.user._id ? req.user._id.toString() : null;
    if (!userId) {
      return;
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }



    // Check if userId already exists in views array
    const alreadyViewed = product.views.some(
      (id) => id.toString() === userId
    );

    if (alreadyViewed) {
      return res.json({ message: "View count already updated", views: product.views.length });
    }

    product.views.push(userId);
    await product.save();

    res.json({ message: "View count updated", views: product.views.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  createProduct,
  getAllProducts,
  updateProductDetails,
  deleteProductById,
  fetchProducts,
  getProductById,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  getMyProducts,
  increaseViewCount,
};

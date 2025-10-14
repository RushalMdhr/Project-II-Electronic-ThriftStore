import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import fs from "fs";
import path from "path";

const createProduct = asyncHandler(async (req, res) => {
  console.time("createProduct");
  try {
    const images = JSON.parse(req.fields["images"] || "[]");
    // console.log("images : ", images);
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
      uploadedBy: req.user._id,
    });
    await product.save();
    // Increment the used count for the category
    await Category.findByIdAndUpdate(product.category, { $inc: { used: 1 } });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
  console.timeEnd("createProduct");
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate("uploadedBy", "username") // populate vendor name here
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
  console.time("updateProductDetails");

  try {
    const formData = {
      ...req.fields, // Spread all fields first
      images: JSON.parse(req.fields?.images || "[]"), // Then parse images
    };
    // console.log(formData);
    const updates = formData; // dynamic updates from client

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldCategory = product.category?.toString();

    // update only provided fields
    Object.assign(product, updates);
    await product.save();

    // if category changed, adjust counts
    if (updates.category && updates.category !== oldCategory) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { used: -1 } });
      await Category.findByIdAndUpdate(updates.category, { $inc: { used: 1 } });
    }
    console.timeEnd("updateProductDetails");

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const deleteProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete product images if any
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        const uploadsDir = path.join(process.cwd(), "uploads");
        const filePath = path.join(uploadsDir, path.basename(imgPath));
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete image:", filePath, err);
        });
      });
    }

    // Decrement category used count ONLY if category exists
    if (product.category) {
      await Category.findByIdAndUpdate(product.category, {
        $inc: { used: -1 },
      });
    }

    // Now delete the product document
    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const getPriceRange = asyncHandler(async (req, res) => {
  try {
    console.log('getting price range for you')
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    if (!priceRange) {
      res.status(404).send("no price range found");
    }
    res.status(200).send(priceRange?.[0]);
  } catch (error) {
    console.error(error)
    res.status(500).send("internal error")
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    // console.log(
    //   req.query.productId ? "product filter need" : "product filter no need"
    // );
    // if overview related product haru thorei hunxa : navaye shop ko laagi dherei
    console.log("query", req.query);
    const pageSize = req.query.productId ? 4 : 12;
    console.log(pageSize);

    const page = Number(req.query.page) || 1;
    let priceRange;
    // How to sort
    let sortOption = { createdAt: -1 }; // Default sort
    const { min, max, category, condition, sort } = req.query;

    // Handle sorting from frontend
    if (sort) {
      switch (req.query.sort) {
        case "price-low":
          sortOption = { price: 1 }; // Ascending
          break;
        case "price-high":
          sortOption = { price: -1 }; // Descending
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "oldest":
          sortOption = { createdAt: 1 };
          break;
        case "popular":
          sortOption = { views: -1 }; // Most viewed
          break;
      }
    }

    // Search keyword
    let dbFilter = {};

    const keyword = req.query.keyword
      ? decodeURIComponent(req.query.keyword).trim()
      : "";
    console.log(
      "Keyword:",
      keyword,
      "Length:",
      keyword.length,
      "Truthy:",
      !!keyword,
      "sortOption: ",
      sortOption
    );
    if (keyword.length > 0 && keyword.length < 3) {
      return res
        .status(400)
        .json({ error: "Minimum 3 characters required for search" });
    }

    if (req.query.productId) {
      dbFilter._id = { $ne: req.query.productId };
    }
    // Only add search if keyword is present and not empty
    if (keyword && keyword !== "null" && keyword !== "undefined") {
      dbFilter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    // console.log(keyword, "keyword");

    // Exclude own products only if logged in as vendor
    if (req.user !== null && req.user.isVendor) {
      dbFilter.uploadedBy = { $ne: req.user._id };
    }
    if (min || max) {
      dbFilter.price = {};
      if (min) dbFilter.price.$gte = Number(min);
      if (max) dbFilter.price.$lte = Number(max);
    }
    console.log("priceRange : ", priceRange);
    console.log("condtion : ", condition);
    if (category) {
      dbFilter.category = category;
    }
    if (condition) {
      dbFilter.condition = condition;
    }

    const count = await Product.countDocuments(dbFilter);
    const products = await Product.find(dbFilter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category", "name")
      .populate("uploadedBy", "username");

    // const transformedProducts = products.map(p=>({
    //   ...p.toObject(),
    //   views : p.views ? p.views.length : 0,
    // }));

    res.json({
      count,
      // transformedProducts,
      products,
      page,
      priceRange: priceRange?.[0],
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error("error : ", error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate("category", "name")
      .populate("uploadedBy", "username");
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
    const products = await Product.find({})
      .sort({ views: -1 })
      .limit(4)
      .populate("category", "name")
      .populate("uploadedBy", "username");
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

// Fetch products grouped by category
const fetchGroupedProducts = asyncHandler(async (req, res) => {
  try {
    // Get categories sorted by 'used' descending
    const categories = await Category.find({}).sort({ used: -1 }).limit(4);
    // console.log(categories);

    // Get products grouped by category
    const groupedProducts = await Product.aggregate([
      { $sort: { views: -1 } }, // sort products by views first
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          products: { $slice: ["$products", 4] }, // limit 4 per category
        },
      },
    ]);

    // Map category info to grouped products and sort by category 'used'
    const result = categories.map((cat) => {
      const group = groupedProducts.find(
        (g) => g._id && g._id.toString() === cat._id.toString()
      );
      return {
        category: cat,
        products: group ? group.products : [],
        count: group ? group.count : 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const getMyProducts = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.params;
    const myProducts = await Product.find({ uploadedBy: vendorId }).populate(
      "category"
    );
    res.send(myProducts);
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
    const alreadyViewed = product.views.some((id) => id.toString() === userId);

    if (alreadyViewed) {
      return res.json({
        message: "View count already updated",
        views: product.views.length,
      });
    }

    product.views.push(userId);
    await product.save();

    res.json({ message: "View count updated", views: product.views.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
const reportProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const userId = req.user._id.toString();
    const alreadyReported =
      product.reported &&
      product.reported.some((report) => report.user.toString() === userId);
    if (alreadyReported) {
      return res
        .status(400)
        .json({ error: "You have already reported this product." });
    }
    // ...existing code for reporting (add report logic here)
    const { reason } = req.body;
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "Reason is required" });
    }
    product.reported.push({
      user: req.user._id,
      reason: reason.trim(),
    });
    res.send(product);
    await product.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  createProduct,
  getAllProducts,
  deleteProductById,
  updateProductDetails,
  fetchProducts,
  getProductById,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  getMyProducts,
  increaseViewCount,
  fetchGroupedProducts,
  reportProduct,
  getPriceRange,
};

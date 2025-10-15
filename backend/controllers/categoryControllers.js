import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();
        const mappedCategories = categories.map((category) => ({
        ...category.toObject(),
        id: category._id.toString(),
        }));
        res.json(mappedCategories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

const createCategory = asyncHandler(async(req,res)=>{
  const { name } = req.body;
  const image = req.file ? `/uploads/categories/${req.file.filename}` : "";

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid category name' });
    }

    try {
        const newCategory = new Category({ name, image });
        const savedCategory = await newCategory.save();
        res.status(201).json({
          id: savedCategory._id.toString(),
          name: savedCategory.name,
          image: savedCategory.image,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})


export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? `/uploads/categories/${req.file.filename}` : null;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update only if values are provided
    if (name && name.trim() !== "") category.name = name;
    if (image) category.image = image;

    const updatedCategory = await category.save();

    res.status(200).json({
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      image: updatedCategory.image,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne(); // or category.remove()
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getTopCategories = asyncHandler(async(req,res)=>{
  try {
    const topCategories = await Category.find().sort({ used: -1 }).limit(10);
    console.log(topCategories);
    res.send(topCategories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    
  }
})

export { getAllCategories,createCategory,getTopCategories };
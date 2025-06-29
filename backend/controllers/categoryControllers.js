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

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid category name' });
    }

    try {
        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();
        res.status(201).json({
            id: savedCategory._id.toString(),
            name: savedCategory.name,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})


export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export { getAllCategories,createCategory };
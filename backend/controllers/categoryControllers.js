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

export { getAllCategories,createCategory };
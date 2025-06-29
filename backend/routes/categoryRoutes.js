import express from 'express';
import { getAllCategories, createCategory, updateCategory,deleteCategory } from '../controllers/categoryControllers.js';
const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

router.route("/:id").put(updateCategory); 
router.route("/:id").delete(deleteCategory);

export default router;
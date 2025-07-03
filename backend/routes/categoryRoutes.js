import express from 'express';
import { getAllCategories, createCategory, updateCategory,deleteCategory } from '../controllers/categoryControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route("/").get( getAllCategories).post(authenticate, createCategory);

router.route("/:id").put(authenticate, updateCategory).delete(authenticate, deleteCategory);

export default router;
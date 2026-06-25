import express from 'express';
import { getProducts } from '../03-controllers/productController.js';

const router = express.Router();

// Define route for fetching products with cursor pagination
router.get('/', getProducts);

export default router;

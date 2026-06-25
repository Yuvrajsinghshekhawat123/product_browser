import mongoose from 'mongoose';
import Product from '../02-models/Product.js';

/**
 * GET /api/products
 * Retrieves products with cursor pagination and optional category filtering.
 * Sort order: updatedAt descending, then _id descending.
 */
export const getProducts = async (req, res, next) => {
  try {
    const { limit = 20, category, cursorUpdatedAt, cursorId } = req.query;
    
    // Parse pagination limit
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

    // Build the query
    const query = {};

    // 1. Apply category filter if provided
    if (category) {
      query.category = category;
    }

    // 2. Apply cursor filter for paginating to the next page
    if (cursorUpdatedAt && cursorId) {
      const cursorDate = new Date(cursorUpdatedAt);
      
      // Ensure cursorId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(cursorId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cursorId format. Must be a valid MongoDB ObjectId.',
        });
      }
      
      const cursorObjId = new mongoose.Types.ObjectId(cursorId);

      // Perform cursor filter:
      // Show products with updatedAt strictly less than cursor date, OR
      // products with updatedAt equal to cursor date but _id strictly less than cursor _id.
      query.$or = [
        { updatedAt: { $lt: cursorDate } },
        {
          updatedAt: cursorDate,
          _id: { $lt: cursorObjId }
        }
      ];
    }

    // Fetch limit + 1 products to check if there are more items to paginate
    const products = await Product.find(query)
      .sort({ updatedAt: -1, _id: -1 })
      .limit(parsedLimit + 1);

    // Determine if there is another page
    let hasMore = false;
    let nextCursor = null;

    if (products.length > parsedLimit) {
      hasMore = true;
      // Remove the extra product used for detecting hasMore
      products.pop();
      
      // Create the cursor from the last product of the current batch
      const lastProduct = products[products.length - 1];
      nextCursor = {
        updatedAt: lastProduct.updatedAt.toISOString(),
        id: lastProduct._id.toString()
      };
    }

    // Return response in the required format
    return res.status(200).json({
      success: true,
      products,
      nextCursor,
      hasMore
    });
  } catch (error) {
    // Pass errors to the centralized error handling middleware
    next(error);
  }
};

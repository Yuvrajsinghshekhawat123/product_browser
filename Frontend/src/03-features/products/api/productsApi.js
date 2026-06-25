import axiosClient from '../../../01-api/axiosClient.js';

/**
 * Fetch products from the backend API.
 * Uses cursor pagination parameters: limit, category, cursorUpdatedAt, cursorId.
 */
export const fetchProducts = async ({ limit = 20, category, cursorUpdatedAt, cursorId }) => {
  const params = { limit };
  
  if (category) {
    params.category = category;
  }
  if (cursorUpdatedAt) {
    params.cursorUpdatedAt = cursorUpdatedAt;
  }
  if (cursorId) {
    params.cursorId = cursorId;
  }

  const response = await axiosClient.get('/products', { params });
  return response.data; // Expected format: { success, products, nextCursor, hasMore }
};

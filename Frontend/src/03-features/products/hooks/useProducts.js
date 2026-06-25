import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productsApi.js';

/**
 * React Query hook to manage infinite scroll pagination for products.
 * Automatically handles cursor propagation and resets on category change.
 */
export const useProducts = ({ category, limit = 20 }) => {
  return useInfiniteQuery({
    queryKey: ['products', { category, limit }],
    queryFn: async ({ pageParam }) => {
      // pageParam is the cursor returned by getNextPageParam, structure: { updatedAt, id }
      const cursorUpdatedAt = pageParam ? pageParam.updatedAt : undefined;
      const cursorId = pageParam ? pageParam.id : undefined;

      return fetchProducts({
        limit,
        category,
        cursorUpdatedAt,
        cursorId,
      });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      // Check if backend reports there is more data and provides a valid cursor
      if (lastPage.hasMore && lastPage.nextCursor) {
        return lastPage.nextCursor; // Returned object will be passed as pageParam in next fetch
      }
      return undefined; // Stop infinite queries
    },
    // Keep previous data when changing category filters to avoid flickering UI
    placeholderData: (previousData) => previousData,
  });
};

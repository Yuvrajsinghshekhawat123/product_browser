import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productsApi";

// Function to fetch one page of products
async function getProducts({ pageParam, category, limit }) {
  const response = await fetchProducts({
    limit,
    category,
    cursorUpdatedAt: pageParam ? pageParam.updatedAt : undefined,
    cursorId: pageParam ? pageParam.id : undefined,
  });

  return response;
}

// Function to decide the next cursor
function getNextCursor(lastPage) {
  if (lastPage.hasMore) {
    return lastPage.nextCursor;
  }

  return undefined;
}

// Custom Hook
export function useProducts({ category, limit = 20 }) {
  const query = useInfiniteQuery({
    queryKey: ["products", category],

    queryFn: ({ pageParam }) => { // You are NOT passing pageParam. React Query passes it automatically.
      return getProducts({
        pageParam,
        category,
        limit,
      });
    },

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return getNextCursor(lastPage);
    },
  });

  return query;
}
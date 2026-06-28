import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../03-features/products/hooks/useProducts.js';
import CategoryFilter from '../02-Components/CategoryFilter/CategoryFilter.jsx';
import ProductGrid from '../02-Components/ProductGrid/ProductGrid.jsx';
import Loader from '../02-Components/Loader/Loader.jsx';
import { ArrowDown, AlertTriangle, Terminal } from 'lucide-react';

/**
 * Home Page displays the product listings, category selector,
 * pagination metrics, and handles infinite scrolling/manual pagination.
 */
const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const limit = 20;

  // React Query hook call
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useProducts({ category: selectedCategory, limit });

  // Flatten all products from all pages retrieved so far
  const products = data?.pages.flatMap((page) => page.products) || [];
  
  // Extract next cursor info from the last loaded page for visualization
  const lastPage = data?.pages[data.pages.length - 1];
  const currentNextCursor = lastPage?.nextCursor;

  // Ref for Infinite Scroll intersection monitoring
  const loadMoreObserverRef = useRef(null);

  // Setup Intersection Observer for auto-triggering page loads
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Trigger next page load if scrolled into view, has more data, and isn't already fetching
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreObserverRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle category change: reset state and trigger refetch
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div class="space-y-6">
      
      {/* Intro Header / Banner */}
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900 border border-brand-850 p-6 sm:p-8">
        <div class="relative z-10 max-w-2xl">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-500/10 text-accent-500 border border-accent-500/20 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
            Performance Tested: 200,000 Products
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Seamless Cursor Pagination
          </h2>
          <p class="mt-2 text-sm sm:text-base text-brand-400 font-medium">
            Browse items without duplicate views or missing updates. This demo operates using 
            Mongoose compound index matching on <code class="text-accent-500 bg-brand-900 px-1 py-0.5 rounded font-mono text-xs">updatedAt + _id</code>.
          </p>
        </div>
      </div>

      {/* Categories Bar */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Pagination Statistics Debug Bar */}
      {products.length > 0 && (
        <div class="p-4 rounded-2xl bg-brand-950 border border-brand-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono text-brand-400">
          <div class="flex items-center gap-2">
            <Terminal class="w-4 h-4 text-accent-500" />
            <span>Loaded: <strong class="text-white font-sans">{products.length}</strong> products</span>
          </div>
          {currentNextCursor ? (
            <div class="flex flex-wrap items-center gap-3">
              <span>Next Cursor:</span>
              <span class="bg-brand-900 text-brand-300 px-2 py-1 rounded border border-brand-850 truncate max-w-[200px]">
                updatedAt: {currentNextCursor.updatedAt}
              </span>
              <span class="bg-brand-900 text-brand-300 px-2 py-1 rounded border border-brand-850">
                _id: {currentNextCursor.id}
              </span>
            </div>
          ) : (
            <span class="text-brand-500">Cursor Exhausted (No more products)</span>
          )}
        </div>
      )}

      {/* Main Content State Rendering */}
      {isLoading ? (
        <Loader count={8} />
      ) : isError ? (
        <div class="flex flex-col items-center justify-center py-16 px-4 text-center glass rounded-3xl border border-red-500/20">
          <div class="p-4 bg-red-500/10 rounded-full mb-4 border border-red-500/25">
            <AlertTriangle class="w-12 h-12 text-red-400" />
          </div>
          <h3 class="text-lg font-bold text-white mb-1">Server connection error</h3>
          <p class="text-sm text-brand-400 max-w-sm mb-4">
            Could not communicate with the backend. {error.message}. Ensure the API server is running.
          </p>
          <button 
            onClick={() => refetch()}
            class="px-4 py-2 bg-brand-900 text-white rounded-xl text-xs font-semibold border border-brand-800 hover:border-brand-700 hover:bg-brand-850 transition-colors"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <ProductGrid products={products} />

          {/* Loader for next pages */}
          {isFetchingNextPage && (
            <div class="mt-8">
              <Loader count={4} />
            </div>
          )}

          {/* Infinite Scroll trigger target & manual Load More button */}
          {hasNextPage && (
            <div 
              ref={loadMoreObserverRef}
              class="pt-10 pb-6 flex flex-col items-center justify-center gap-3"
            >
              <button
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                class="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 hover:bg-brand-850 disabled:bg-brand-950 text-white disabled:text-brand-500 rounded-xl text-sm font-semibold border border-brand-800 hover:border-brand-700 disabled:border-brand-900 shadow-lg shadow-brand-950/20 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? (
                  <>
                    <span class="w-4 h-4 border-2 border-brand-400 border-t-white rounded-full animate-spin"></span>
                    Loading Batch...
                  </>
                ) : (
                  <>
                    <ArrowDown class="w-4 h-4" />
                    Load More Products
                  </>
                )}
              </button>
              
              <span class="text-[10px] text-brand-500 font-mono">
                Auto-loading triggers when scrolling close to this view.
              </span>
            </div>
          )}

          {/* End of results message */}
          {!hasNextPage && products.length > 0 && (
            <div class="text-center py-12 text-sm text-brand-500 font-medium">
              🎉 You have reached the end of the directory. All products fetched successfully.
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Home;

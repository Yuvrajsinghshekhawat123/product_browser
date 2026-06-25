import React from 'react';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { PackageOpen } from 'lucide-react';

/**
 * ProductGrid handles displaying product cards or an empty state
 */
const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div class="flex flex-col items-center justify-center py-16 px-4 text-center glass rounded-3xl border border-brand-900/50">
        <div class="p-4 bg-brand-900/80 rounded-full mb-4 border border-brand-800">
          <PackageOpen class="w-12 h-12 text-brand-500" />
        </div>
        <h3 class="text-lg font-bold text-white mb-1">No products found</h3>
        <p class="text-sm text-brand-400 max-w-sm">
          No items match this category. Run the database seed script to populate products.
        </p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

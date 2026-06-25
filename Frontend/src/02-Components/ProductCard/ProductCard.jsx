import React from 'react';
import { Calendar, Tag, HardDrive } from 'lucide-react';

/**
 * Premium glassmorphic card to display product info and technical keys
 */
const ProductCard = ({ product }) => {
  const formattedDate = new Date(product.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div class="glass glass-hover rounded-2xl p-5 flex flex-col justify-between h-64 animate-fade-in">
      
      {/* Category Tag & Price */}
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-brand-850 text-accent-500 border border-brand-800">
          <Tag class="w-3 h-3" />
          {product.category}
        </span>
        <span class="text-lg font-bold text-white tracking-tight">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Product Name */}
      <div class="flex-grow">
        <h3 class="text-base font-semibold text-brand-100 line-clamp-2 hover:text-white transition-colors">
          {product.name}
        </h3>
      </div>

      {/* Technical Data (for debug & interview clarity) */}
      <div class="mt-4 pt-3 border-t border-brand-800/60 flex flex-col gap-1.5 text-[10px] text-brand-400 font-mono">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1">
            <Calendar class="w-3 h-3 text-brand-500" />
            updatedAt:
          </span>
          <span class="text-brand-300 truncate max-w-[170px]" title={product.updatedAt}>
            {formattedDate}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1">
            <HardDrive class="w-3 h-3 text-brand-500" />
            _id:
          </span>
          <span class="text-brand-300 select-all" title={product._id}>
            {product._id}
          </span>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;

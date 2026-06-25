import React from 'react';

const categories = [
  { name: 'All Products', value: '' },
  { name: 'Electronics', value: 'Electronics' },
  { name: 'Books', value: 'Books' },
  { name: 'Shoes', value: 'Shoes' },
  { name: 'Clothing', value: 'Clothing' },
  { name: 'Sports', value: 'Sports' },
  { name: 'Beauty', value: 'Beauty' },
  { name: 'Kitchen', value: 'Kitchen' },
  { name: 'Furniture', value: 'Furniture' },
  { name: 'Home', value: 'Home' },
  { name: 'Toys', value: 'Toys' }
];

/**
 * CategoryFilter component renders selectable category tags
 */
const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div class="w-full py-4 border-b border-brand-900/50">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold tracking-wider text-brand-400 uppercase">
          Filter by Category
        </h2>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('')}
            class="text-xs text-accent-500 hover:text-accent-600 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>
      
      {/* Scrollable list of categories */}
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.value)}
              class={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-accent-500 text-brand-950 border-accent-500 shadow-md shadow-accent-500/10'
                  : 'bg-brand-900 text-brand-300 border-brand-800 hover:border-brand-700 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;

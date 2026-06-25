import React from 'react';

/**
 * Loader component displaying skeleton cards for smooth loading state transitions
 */
const Loader = ({ count = 8 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletons.map((_, index) => (
        <div 
          key={index}
          class="glass rounded-2xl p-5 flex flex-col justify-between h-64 animate-pulse-subtle"
        >
          {/* Top Tag & Price Skeleton */}
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="h-6 w-20 bg-brand-850 rounded-md border border-brand-800"></div>
            <div class="h-6 w-16 bg-brand-850 rounded-md"></div>
          </div>

          {/* Name Skeleton */}
          <div class="flex-grow space-y-2 mt-2">
            <div class="h-4 w-5/6 bg-brand-850 rounded"></div>
            <div class="h-4 w-2/3 bg-brand-850 rounded"></div>
          </div>

          {/* Bottom Meta Skeleton */}
          <div class="mt-4 pt-3 border-t border-brand-800/60 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="h-3 w-16 bg-brand-850 rounded"></div>
              <div class="h-3 w-28 bg-brand-850 rounded"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="h-3 w-12 bg-brand-850 rounded"></div>
              <div class="h-3 w-32 bg-brand-850 rounded"></div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Loader;

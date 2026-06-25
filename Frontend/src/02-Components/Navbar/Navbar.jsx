import React from 'react';
import { Layers, Database, Cpu } from 'lucide-react';

/**
 * Navbar component with sleek glassmorphism design and real-time architecture tags
 */
const Navbar = () => {
  return (
    <nav class="sticky top-0 z-50 glass border-b border-brand-800/80 px-4 py-3 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-tr from-accent-600 to-accent-500 rounded-xl shadow-lg shadow-accent-500/10">
            <Layers class="w-6 h-6 text-brand-950 font-bold" />
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-white font-sans">
              Product<span class="text-accent-500">Browser</span>
            </h1>
            <p class="text-xs text-brand-400 font-medium">Enterprise Pagination Engine</p>
          </div>
        </div>

        {/* System Architecture Metadata Tags */}
        <div class="flex flex-wrap items-center gap-3 text-xs">
          
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-900 border border-brand-800 text-brand-300">
            <Database class="w-3.5 h-3.5 text-accent-500" />
            <span>MongoDB Database</span>
          </div>

          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-900 border border-brand-800 text-brand-300">
            <Cpu class="w-3.5 h-3.5 text-green-400" />
            <span>Cursor Pagination (`updatedAt` + `_id`)</span>
          </div>
          
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

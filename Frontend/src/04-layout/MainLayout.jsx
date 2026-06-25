import React from 'react';
import Navbar from '../02-Components/Navbar/Navbar.jsx';

/**
 * MainLayout provides standard structure (header, main, footer) for pages
 */
const MainLayout = ({ children }) => {
  return (
    <div class="min-h-screen bg-brand-950 text-brand-100 flex flex-col font-sans">
      {/* Premium Header */}
      <Navbar />

      {/* Main Content Area */}
      <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* System Footer */}
      <footer class="border-t border-brand-900 bg-brand-950/80 py-6 text-center text-xs text-brand-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Product Browser. Built with MERN Stack + Docker.</p>
          <p class="font-mono text-[10px] text-brand-600">
            Cursor pagination: [updatedAt, _id] desc. Indexes applied.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

import React from 'react';
import MainLayout from '../04-layout/MainLayout.jsx';
import Home from '../05-pages/Home.jsx';

/**
 * AppRoutes coordinates application pages. 
 * Renders the Home page wrapped in MainLayout.
 */
const AppRoutes = () => {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
};

export default AppRoutes;

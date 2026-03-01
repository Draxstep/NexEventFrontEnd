import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Navbar from './components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
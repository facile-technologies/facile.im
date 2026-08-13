import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SessionExpiryModal from '../common/SessionExpiryModal';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-zinc-950 overflow-hidden font-inter text-text-primary-light dark:text-text-primary-dark">
      <SessionExpiryModal />
      {/* Sidebar - Handles its own width transition states internally, 
          but usually we need to know width here for padding if fixed/absolute. 
          However, the new Sidebar handles "static" positioning on desktop, so Flexbox handles the layout automatically! 
          The Sidebar component flips between fixed (mobile) and static (desktop).
      */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header onMenuClick={toggleSidebar} />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-full mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

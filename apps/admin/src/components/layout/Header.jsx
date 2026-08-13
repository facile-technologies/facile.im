import React from 'react';
import { Menu, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toggleTheme } from '../../store/features/themeSlice';
import { logout } from '../../store/features/authSlice';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/sections': return 'Sections';
      case '/profiles': return 'Profiles';
      case '/customers': return 'Customers';
      case '/business-requests': return 'Business Requests';
      case '/business-plans': return 'Business Plans';
      case '/analytics': return 'Analytics';
      case '/settings': return 'Settings';
      default:
        if (pathname.includes('/nfc')) return 'NFC Chips';
        return 'Overview';
    }
  };

  return (
    <header className="h-[72px] mx-4 mt-4 px-6 sm:px-8 flex items-center justify-between sticky top-4 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-zinc-800/50 shadow-lg shadow-gray-200/50 dark:shadow-black/20 rounded-2xl transition-all duration-300">

      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Notifications */}
        <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 relative transition-colors group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black ring-2 ring-white dark:ring-black"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-primary dark:text-purple-400 transition-all hover:rotate-12"
          title="Toggle Theme"
        >
          {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-zinc-800 mx-1"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Settings,
  ChevronLeft,
  ChevronDown,
  ShoppingBag,
  Users,
  BarChart3,
  Cpu, // Using CPU as NFC placeholder
  Briefcase,
  Files,
  Shield
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Track which submenu is open
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Shield, label: 'Teams', path: '/teams' },
    { icon: ShoppingBag, label: 'Platform Links', path: '/platform-links' },
    {
      icon: Cpu,
      label: 'NFC Chips',
      subItems: [
        { label: 'Produced', path: '/nfc/produced' },
        { label: 'Mapped', path: '/nfc/mapped' },
        { label: 'Unmapped', path: '/nfc/unmapped' },
        { label: 'Deactivated', path: '/nfc/deactivated' },
      ]
    },
    // { icon: Briefcase, label: 'Business Requests', path: '/coming-soon' },
    { icon: Files, label: 'Business Plans', path: '/business-plans' },
    // { icon: Settings, label: 'Settings', path: '/coming-soon' },
  ];

  const handleSubmenuClick = (label) => {
    if (isCollapsed) {
      setIsCollapsed(false); // Auto expand sidebar if clicking a submenu trigger
      setTimeout(() => setOpenSubmenu(openSubmenu === label ? null : label), 150);
    } else {
      setOpenSubmenu(openSubmenu === label ? null : label);
    }
  };

  // Helper to check if a parent is active based on child routes
  const isParentActive = (subItems) => {
    return subItems.some(sub => matchPath({ path: sub.path, end: false }, location.pathname));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50",
          "bg-zinc-900",
          "border border-zinc-800",
          "transition-all duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-[80px]" : "lg:w-[280px]",
          "w-[280px]",
          // Desktop Floating Styles
          "lg:my-4 lg:ml-4 lg:rounded-2xl lg:h-[calc(100vh-32px)]",
          "lg:shadow-xl lg:shadow-black/20",
          // Mobile Fixed Styles
          "h-full shadow-2xl lg:shadow-none"
        )}
      >
        {/* Header / Brand */}
        <div className={cn(
          "h-20 flex items-center border-b border-zinc-800 relative transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
              <ShoppingBag size={20} />
            </div>
            <span className={cn(
              "font-bold text-xl text-white transition-all duration-200", // Force white text
              isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
            )}>
              Facile
            </span>
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-gray-400 hover:text-white transition-colors shadow-sm z-50",
              isCollapsed ? "rotate-180" : ""
            )}
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto space-y-1 custom-scrollbar",
          isCollapsed ? "px-2 py-6" : "px-4 py-6" // Reduced padding when collapsed
        )}>
          {menuItems.map((item) => {
            // --------------------------
            // Logic for Submenu Items
            // --------------------------
            if (item.subItems) {
              const isActive = isParentActive(item.subItems);
              const isOpen = openSubmenu === item.label || isActive; // Keep open if active

              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => handleSubmenuClick(item.label)}
                    className={cn(
                      "relative group flex items-center justify-between w-full rounded-xl transition-all duration-200",
                      isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3",
                      isActive // Highlight parent if child active
                        ? "bg-zinc-800/50 text-white"
                        : "text-gray-400 hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={22} className="shrink-0" />
                      <span className={cn(
                        "font-medium whitespace-nowrap transition-all duration-200",
                        isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                      )}>
                        {item.label}
                      </span>
                    </div>

                    {/* Arrow Icon */}
                    {!isCollapsed && (
                      <ChevronDown size={16} className={cn("transition-transform duration-200", (openSubmenu === item.label) ? "rotate-180" : "")} />
                    )}
                  </button>

                  {/* Submenu Dropdown */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out pl-10 space-y-1", // Indent subitems
                    (openSubmenu === item.label) && !isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        className={({ isActive }) => cn(
                          "block px-3 py-2 rounded-lg text-sm font-medium transition-colors border-l-2 border-transparent",
                          isActive
                            ? "text-primary border-primary bg-primary/10"
                            : "text-gray-500 hover:text-white hover:bg-zinc-800"
                        )}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            // --------------------------
            // Logic for Normal Items
            // --------------------------
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "relative group flex items-center rounded-xl transition-all duration-200",
                  isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-gray-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <item.icon size={22} className="shrink-0" />

                <span className={cn(
                  "font-medium whitespace-nowrap transition-all duration-200",
                  isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                )}>
                  {item.label}
                </span>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-white text-zinc-900 text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] whitespace-nowrap shadow-xl">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-zinc-800">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-800 transition-all duration-200",
            isCollapsed ? "justify-center p-2" : ""
          )}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              A
            </div>
            <div className={cn(
              "overflow-hidden transition-all duration-200",
              isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
            )}>
              <p className="text-sm font-bold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@fecile.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

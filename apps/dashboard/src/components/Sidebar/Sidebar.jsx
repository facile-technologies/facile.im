// components/Layout/Sidebar.jsx

import {
  BarChart,
  ChevronDown,
  Monitor,
  LogOut,
  UserPlus,
  MonitorSmartphone,
  Mail,
  UsersRound,
  ChartColumn,
  Home,
  Settings,
  ShoppingCart,
  Lock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });
  const [isProfileOpen, setIsProfileOpen] = useState(null);

  // Get subscription plan from global user state (persists across navigation)
  const subscriptionPlan = useSelector((state) => state.user?.subscriptionPlan);
  // Fallback to dashboard data if subscription plan not yet loaded
  const dashboardData = useSelector((state) => state.dashboard?.data);
  const userPlan = subscriptionPlan || dashboardData?.userPlan;
  // Expecting a 'features' array from the backend inside a 'userPlan' object
  const allowedFeatures = (userPlan?.features || []).map((f) =>
    f.toLowerCase(),
  );
  const profileMode = useSelector((state) => state.user.profileMode);

  const currentPath = location.pathname;
  useEffect(() => {
    const activeMenu = menu.find((item) =>
      item.subMenu?.some((sub) => sub.path === currentPath),
    );

    if (activeMenu) {
      setIsProfileOpen(activeMenu.name);
    }
  }, [currentPath]);

  const menu = [
    { name: "Home", icon: Home, path: "/home", isLocked: false },
    {
      name: "Profiles",
      icon: UserPlus,
      path: "/profiles",
      isLocked: false,
      subMenu: [
        { name: "View Profiles", path: "/profiles" },
        // { name: "Edit Profile", path: "/edit-profile" },
        // { name: "Profile Layout", path: "/profile-layout" },
      ],
    },
    {
      name: "Devices",
      icon: MonitorSmartphone,
      path: "/devices",
      isLocked: !allowedFeatures.includes("devices"),
    },
    {
      name: "Contacts",
      icon: Mail,
      path: "/contacts",
      isLocked: !allowedFeatures.includes("contacts"),
    },
    {
      name: "Teams",
      icon: UsersRound,
      path: "/teams",
      // Locks if 'teams' is NOT in the allowed features array
      isLocked: !allowedFeatures.includes("teams"),
      subMenu: [
        { name: "Members", path: "/teams" },
        { name: "Invite Members", path: "/teams/invite-members" },
        { name: "Templates", path: "/teams/templates" },
      ],
    },
    {
      name: "Products",
      icon: ShoppingCart,
      path: "/products/manage-inventory",
      isLocked: !allowedFeatures.includes("products"),
      subMenu: [
        { name: "Manage Inventory", path: "/products/manage-inventory" },
        { name: "Sales Analytics", path: "/products/sales-analytics" },
        { name: "Orders", path: "/products/order-list" },
      ],
    },

    {
      name: "Analytics",
      icon: ChartColumn,
      path: "/analytics",
      isLocked: !allowedFeatures.includes("analytics"),
    },
    { name: "Settings", icon: Settings, path: "/settings", isLocked: false },
  ];

  // RescueID mode: only show Home, Profiles, Devices, Settings
  const rescueOnlyItems = ["Home", "Profiles", "Devices", "Settings"];
  const visibleMenu =
    profileMode === "rescue"
      ? menu.filter((item) => rescueOnlyItems.includes(item.name))
      : menu;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isItemActive = (item) => {
    if (item.path && currentPath === item.path) return true;
    if (item.subMenu)
      return item.subMenu.some((sub) => currentPath === sub.path);
    return false;
  };

  return (
    <>
      <div className="">
        <aside
          className={`fixed  lg:relative top-0 left-0 ${isProfileOpen ? "min-h-screen" : "min-h-screen"} z-60 lg:z-auto transition-transform duration-300
            w-[245px] flex flex-col pt-6 p-4 gap-7 ${isDarkMode ? "bg-[#363636]" : "bg-white"}
            ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <img
            src={isDarkMode ? "/facile.svg" : "/Facile-black.svg"}
            alt="Facile"
            className="w-[90px] md:w-[110px] ml-5 h-auto object-contain transition-all duration-300 mb-4 lg:mb-0"
          />

          <nav className="flex flex-col gap-2 flex-1">
            {visibleMenu.map(
              ({ name, icon: Icon, path, subMenu, isLocked }) => {
                const active = isItemActive({ path, subMenu });

                return (
                  <div key={name}>
                    <button
                      onClick={() => {
                        if (isLocked) {
                          setIsOpen(false);
                          navigate("/pricing-plan");
                          return;
                        }

                        if (subMenu) {
                          setIsProfileOpen(name);
                        }
                        if (!subMenu) {
                          setIsProfileOpen(null);
                        }
                        if (isProfileOpen === name) {
                          setIsProfileOpen(null);
                        } else {
                          navigate(path);
                          setIsOpen(false);
                        }
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-[15px] transition-all duration-200 cursor-pointer text-left
                    ${active ? "font-semibold" : "opacity-80 hover:opacity-100"}
                    ${!isDarkMode ? (active ? "bg-black/5 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50") : "hover:bg-transparent"}
                    `}
                      style={
                        isDarkMode
                          ? {
                              backgroundColor: active
                                ? "#3F3F3F"
                                : "transparent",
                              color: active ? "#ffffff" : "#FFFFFF99",
                            }
                          : undefined
                      }
                    >
                      <Icon
                        size={42}
                        className={`p-2 rounded-xl transition-all ${!isDarkMode ? (active ? "bg-black text-white" : "bg-gray-100 text-gray-400") : ""}`}
                        style={
                          isDarkMode
                            ? {
                                backgroundColor: active ? "#000000" : "#3F3F3F",
                                color: "#ffffff",
                              }
                            : undefined
                        }
                      />
                      <span className="truncate flex-1">{name}</span>

                      {isLocked && (
                        <Lock
                          size={16}
                          className={`transition-all duration-300 mr-1 ${!isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        />
                      )}

                      {!isLocked && subMenu && (
                        <ChevronDown
                          size={20}
                          className={`transition-all duration-300 ${
                            isProfileOpen === name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {!isLocked && subMenu && isProfileOpen === name && (
                      <div className="pl-8 mt-2">
                        <div
                          className={`border-l pl-3 space-y-1 ${isDarkMode ? "border-[#FFFFFF99]" : "border-gray-200"}`}
                        >
                          {subMenu.map((sub) => (
                            <a
                              type="button"
                              key={sub.name}
                              onClick={() => {
                                navigate(sub.path);
                                setIsOpen(false);
                              }}
                              className={`block w-full text-left px-6 py-2 text-sm rounded-[12px] transition-all
                          ${!isDarkMode ? (currentPath === sub.path ? "font-medium text-black bg-black/5" : "text-gray-500 hover:bg-gray-50 hover:text-black") : "hover:bg-[#3F3F3F] hover:text-white"}`}
                              style={
                                isDarkMode
                                  ? {
                                      backgroundColor:
                                        currentPath === sub.path
                                          ? "#3F3F3F"
                                          : "transparent",
                                      color:
                                        currentPath === sub.path
                                          ? "#ffffff"
                                          : "#FFFFFF99",
                                      fontWeight:
                                        currentPath === sub.path ? 500 : 400,
                                    }
                                  : undefined
                              }
                            >
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </nav>

          <Button
            variant="ghost"
            className={`mt-auto gap-2 text-red-600 ${isDarkMode ? "hover:bg-transparent" : "hover:bg-red-50"}`}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 lg:hidden z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}

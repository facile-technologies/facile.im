import { Search, BarChart, User, Menu, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menu = [
    {
      name: "Profile",
      icon: User,
      subMenu: [
        {
          name: "Edit Profile",
          action: () => setActiveTab("edit-profile"),
        },
      ],
    },
    { name: "Analytics", icon: BarChart },
  ];

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

  return (
    <>
      <div className="">
        <aside
          className={`fixed lg:relative top-0 left-0 h-full z-[60] lg:z-auto transition-transform duration-300
            w-[245px] bg-white dark:bg-[#363636] flex flex-col pt-6 p-4 gap-7 
            ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <img
            src={isDarkMode ? "/facile.svg" : "/Facile-black.svg"}
            alt="Facile"
            className="w-[90px] md:w-[110px] ml-5 h-auto object-contain transition-all duration-300 mb-4 lg:mb-0"
          />

          <nav className="flex flex-col gap-2">
            {menu.map(({ name, icon: Icon, subMenu }) => (
              <div key={name}>
                <button
                  onClick={() => {
                    if (name.toLowerCase() === "profile") {
                      setIsProfileOpen(!isProfileOpen);
                    } else {
                      setActiveTab(name.toLowerCase());
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center gap-3 w-full h-[52px] px-4 py-3 rounded-[15px] transition-all duration-200 cursor-pointer text-left
                    ${
                      activeTab === name.toLowerCase()
                        ? "font-semibold"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  style={{
                    backgroundColor:
                      activeTab === name.toLowerCase()
                        ? "rgba(0, 0, 0, 0.08)"
                        : "transparent",
                    color: "var(--text-color)",
                  }}
                >
                  <Icon
                    size={30}
                    className={`transition-all duration-300 ${
                      activeTab === name.toLowerCase()
                        ? "bg-black text-white p-2 rounded-xl w-10 h-10"
                        : "bg-none dark:bg-[#3F3F3F] p-2 rounded-xl w-10 h-10"
                    }`}
                  />
                  <span className="truncate">{name}</span>

                  {name === "Profile" && (
                    <ChevronDown
                      size={20}
                      className={`transition-all duration-300 ${
                        isProfileOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </button>

                {isProfileOpen && name === "Profile" && (
                  <div className="ml-5 mt-2 space-y-2 ">
                    {subMenu.map(({ name, action }) => (
                      <a
                        type="button"
                        key={name}
                        onClick={action}
                        className="text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#3a3a3a] w-full py-2 px-4 rounded-md"
                        style={{
                          backgroundColor:
                            activeTab === name.toLowerCase()
                              ? "rgba(0, 0, 0, 0.08)"
                              : "transparent",
                          color: "var(--text-color)",
                        }}
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
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

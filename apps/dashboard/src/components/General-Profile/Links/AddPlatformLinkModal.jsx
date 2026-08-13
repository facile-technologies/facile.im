"use client";
import { X, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchExistingBusinessPlatformLinks } from "@/app/stores/slices/profileSlice";
import { useTheme } from "@/context/Themcontext";
import { getAllPlatformLinks } from "@/services/user";

export default function AddPlatformLinkModal({ onClose, onSave, onSelectPlatform }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const dispatch = useDispatch();
  const profileType = useSelector((state) => state.profile.profileType);
  const existingBusinessPlatformLinks = useSelector(
    (state) => state.profile.businessExistingPlatformLinks || [],
  );
  const [search, setSearch] = useState("");



  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await getAllPlatformLinks();
        console.log("Platforms:", res?.data);
        setPlatforms(res?.data?.platforms || []);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };

    fetchPlatforms();
  }, []);

  // const socialLinks = [
  //   {
  //     name: "Instagram",
  //     icon: "/Instagram.png",
  //     url: "https://www.instagram.com/",
  //   },
  //   {
  //     name: "Snapchat",
  //     icon: "/Snapchat.png",
  //     url: "https://www.snapchat.com/",
  //   },
  //   {
  //     name: "Facebook",
  //     icon: "/Facebook.png",
  //     url: "https://www.facebook.com/",
  //   },
  //   { name: "Youtube", icon: "/Youtube.png", url: "https://www.youtube.com/" },
  //   { name: "Twitter", icon: "/Twitter.png", url: "https://www.twitter.com/" },
  //   { name: "Discord", icon: "/Discord.png", url: "https://www.discord.com/" },
  // ];

  const convertSvgToDataUri = (svg) => {
    if (!svg) return "";
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const formatSectionTitle = (type) => {
    if (!type) return "Others";
    return type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  const businessPlatforms = platforms.map((platform) => {
    const iconMarkup =
      platform?.default_icon ||
      platform?.colored_icon ||
      platform?.white_icon ||
      platform?.black_icon ||
      platform?.stroked_icon ||
      "";

    return {
      name: platform?.name
        ? platform.name.charAt(0).toUpperCase() + platform.name.slice(1)
        : "Link",
      icon: iconMarkup ? convertSvgToDataUri(iconMarkup) : "",
      url: platform?.start_link || "",
      base_url: platform?.start_link || "",
      platform_type: platform?.type || "",
    };
  });

  const sourceLinks = businessPlatforms;

  const filteredLinks = sourceLinks.filter((link) =>
    link.name.toLowerCase().includes(search.toLowerCase()),
  );

  const groupedBusinessLinks = filteredLinks.reduce((acc, link) => {
    const typeKey = (link.platform_type || "others").toLowerCase();
    if (!acc[typeKey]) acc[typeKey] = [];
    acc[typeKey].push(link);
    return acc;
  }, {});

  const renderLinkCard = (link, key) => (
    <div
      key={key}
      className={`flex items-center justify-between rounded-xl px-4 py-3 border transition cursor-pointer ${isDarkMode
        ? "bg-[#2A2A2A] border-transparent hover:bg-[#333333]"
        : "bg-white border-gray-100 shadow-sm hover:border-gray-200"
        }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={link.icon}
          alt={link.name}
          className="w-5 h-5 rounded"
        />
        <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {link.name}
        </span>
      </div>

      <a
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlatform(link);
        }}
        className={`p-1.5 rounded-full transition shadow-sm ${isDarkMode ? "bg-[#3A3A3A] hover:bg-[#4A4A4A]" : "bg-black hover:bg-gray-800"
          }`}
      >
        <Plus size={14} className="text-white" />
      </a>
    </div>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <DialogContent
          showCloseButton={false}
          className="max-w-[680px]! w-full max-h-[80vh] overflow-y-auto custom-scrollbar rounded-2xl p-6 dark:bg-[#262626] bg-[#F5F5F5] border-none ring-0 outline-none shadow-xl"
        >
          <a
            type="button"
            onClick={onClose}
            className={`absolute top-4 right-4 transition p-1 rounded-full ${isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-black hover:bg-gray-100"
              }`}
          >
            <X size={18} />
          </a>

          <h2 className="text-[18px] font-semibold dark:text-white text-black mb-5">
            Add Platform Link
          </h2>

          <div className="relative mb-7">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search platforms..."
              className={`w-full rounded-xl px-3 pl-9 py-3 text-sm outline-none transition-all border ${isDarkMode
                ? "bg-[#1F1F1F] text-white border-transparent focus:border-white/20"
                : "bg-white text-black border-gray-100 focus:border-black/10 shadow-sm"
                } placeholder-gray-400 dark:placeholder-gray-500`}
            />
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              Social Links
            </p>
            <div className="grid grid-cols-3 gap-3">
              {filteredLinks.map((link) => renderLinkCard(link, link.name))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[
              "Contacts",
              "Music",
              "Payment",
              "Entertainment",
              "Lifestyle",
              "Others",
            ].map((section) => (
              <div
                key={section}
                className="flex items-center justify-between px-3 py-2 rounded-lg
                           hover:bg-gray-200 dark:hover:bg-[#333333] transition cursor-pointer"
              >
                <span className="text-black dark:text-white text-[14px] font-medium">
                  {section}
                </span>
                <span className="text-gray-500 dark:text-gray-400">▾</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

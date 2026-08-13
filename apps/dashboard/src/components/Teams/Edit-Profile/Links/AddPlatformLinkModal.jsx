"use client";
import { X, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddLinkDetailsModal from "./AddLinkDetailsModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchExistingBusinessPlatformLinks } from "@/app/stores/slices/profileSlice";

export default function AddPlatformLinkModal({ onClose, onSave }) {
  const dispatch = useDispatch();
  const profileType = useSelector((state) => state.profile.profileType);
  const existingBusinessPlatformLinks = useSelector(
    (state) => state.profile.businessExistingPlatformLinks || [],
  );
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const socialLinks = [
    {
      name: "Instagram",
      icon: "/Instagram.png",
      url: "https://www.instagram.com/",
    },
    {
      name: "Snapchat",
      icon: "/Snapchat.png",
      url: "https://www.snapchat.com/",
    },
    {
      name: "Facebook",
      icon: "/Facebook.png",
      url: "https://www.facebook.com/",
    },
    { name: "Youtube", icon: "/Youtube.png", url: "https://www.youtube.com/" },
    { name: "Twitter", icon: "/Twitter.png", url: "https://www.twitter.com/" },
    { name: "Discord", icon: "/Discord.png", url: "https://www.discord.com/" },
  ];

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

  useEffect(() => {
    if (profileType === "business") {
      dispatch(fetchExistingBusinessPlatformLinks());
    }
  }, [dispatch, profileType]);

  const businessPlatforms = existingBusinessPlatformLinks.map((platform) => {
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

  const sourceLinks =
    profileType === "business" ? businessPlatforms : socialLinks;

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
      className="flex items-center justify-between rounded-lg px-3 py-2
                           dark:bg-[#2A2A2A] bg-[#fff] hover:dark:bg-[#333333] hover:bg-gray-200 
                           transition cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <img
          src={link.icon}
          alt={link.name}
          className="w-5 h-5 rounded"
        />
        <span className="text-black dark:text-white text-sm font-medium">
          {link.name}
        </span>
      </div>

      <a
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPlatform(link);
          setIsOpenModal(true);
        }}
        className="p-1 rounded-full dark:bg-[#3A3A3A] bg-gray-300 hover:dark:bg-[#4A4A4A] hover:bg-gray-400 transition"
      >
        <Plus size={14} className="text-white" />
      </a>
    </div>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <div className=" flex items-start    justify-center mt-10">
        {isOpenModal && (
          <AddLinkDetailsModal
            platform={selectedPlatform}
            onClose={() => setSelectedPlatform(false)}
            onSave={(linkData) => {
              onSave(linkData);
              setSelectedPlatform(null);
              onClose();
            }}
            onclose={() => setIsOpenModal(false)}
          />
        )}

        <DialogContent
          showCloseButton={false}
          className=" max-w-[680px]! w-full! rounded-2xl shadow-xl p-6  dark:bg-[#262626] bg-[#F5F5F5] transition-colors border-0"
        >
          <a
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </a>

          <h2 className="text-[18px] font-semibold dark:text-white text-black mb-5">
            Add Platform Link
          </h2>

          <div className="relative mb-7">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
              className="w-full rounded-md px-3 pl-9 py-2.5 text-sm outline-none 
                       dark:bg-[#1F1F1F] bg-[#fff] dark:text-white text-black 
                       placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {profileType === "business" ? (
            <div className="space-y-6">
              {Object.entries(groupedBusinessLinks).map(([type, links]) => (
                <div key={type} className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {formatSectionTitle(type)}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {links.map((link) =>
                      renderLinkCard(link, `${type}-${link.name}`),
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Social Links
              </p>
              <div className="grid grid-cols-3 gap-3">
                {filteredLinks.map((link) => renderLinkCard(link, link.name))}
              </div>
            </div>
          )}

          {profileType !== "business" && (
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
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import { Search, MessageSquare, Bell, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveTab,
  selectUser,
} from "@/app/stores/selectors/profileSelectors";
import { fetchProfile, setActiveTab } from "@/app/stores/slices/profileSlice";
import ProfileSection from "../General-Profile/layout/EditprofileLayout/ProfileSection";
import ProfileView from "../SOS-Profile/layout/ProfileView";
import SosProfileSection from "../SOS-Profile/layout/EditprofileLayout/SosProfileSection";

export default function SosEditProfile() {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] dark:bg-[#2A2A2A] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-[50]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-1 right-1 z-60 p-2 bg-[#000000] dark:bg-[#2A2A2A] rounded-lg"
      >
        <Menu size={24} />
      </button>

      <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300">
        <div className="flex items-center justify-between px-10 py-2 pt-8">
          <div className="text-[#000000] dark:text-white">
            <h2 className="text-[15px] font-semibold ">
              Edit Your SOS-Profile
            </h2>
            <p className="text-xs">
              <span className="">Profiles</span> &gt;{" "}
              <span className="text-gray-800 dark:text-white font-medium">
                {user?.name}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a className="p-2 bg-[#FFFFFF] dark:bg-[#3F3F3F] rounded-full hover:bg-[#333] transition">
              <Search className="w-4 h-4 text-[#000000] dark:text-[#ffffff]" />
            </a>
            <a className="p-2 bg-[#FFFFFF] dark:bg-[#3F3F3F] rounded-full hover:bg-[#333] transition">
              <MessageSquare className="w-4 h-4 text-[#000000] dark:text-[#ffffff]" />
            </a>
            <a className="p-2 bg-[#FFFFFF] dark:bg-[#3F3F3F] rounded-full hover:bg-[#333] transition">
              <Bell className="w-4 h-4 text-[#000000] dark:text-[#ffffff]" />
            </a>
            <img
              src="/path-to-avatar.jpg"
              alt="User"
              className="w-8 h-8 rounded-full object-cover border border-gray-700"
            />
          </div>
        </div>

        <div
          className={`flex-1 p-4 flex ${
            activeTab === "profile" ? "justify-center items-center" : ""
          }`}
        >
          {activeTab === "profile" && <ProfileView />}
          {activeTab === "edit-profile" && <SosProfileSection />}
          {activeTab === "analytics" && <AnalyticsSection />}
        </div>
      </main>
    </div>
  );
}

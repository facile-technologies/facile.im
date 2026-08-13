import { useEffect, useState } from "react";
import { Search, MessageSquare, Bell, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveTab,
  selectUser,
} from "@/app/stores/selectors/profileSelectors";
import { fetchProfile, setActiveTab } from "@/app/stores/slices/profileSlice";
import ProfileSection from "../General-Profile/layout/EditprofileLayout/ProfileSection";
import ProfileView from "../General-Profile/layout/ProfileView";

export default function ProfileEditPage() {
  
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  return (
    <div className="flex min-h-screen bg-[#F5F5F5] dark:bg-[#2A2A2A] text-white">
      <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300">
        <div
          className={`flex-1 p-4 flex ${
            activeTab === "profile" ? "justify-center items-center" : ""
          }`}
        >
          {/* {activeTab === "profile" && <ProfileView />}
          {activeTab === "edit-profile" && <ProfileSection />}
          {activeTab === "analytics" && <AnalyticsSection />} */}
        </div>
      </main>
    </div>
  );
}

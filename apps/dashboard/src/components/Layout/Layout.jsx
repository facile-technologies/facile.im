import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import { setSidebarTab } from "@/app/stores/slices/sidebarSlice";
import { useEffect, useState, useCallback } from "react";
import AppContent from "@/AppContent";
import TopBar from "./TopBar";
import { getUserProfile } from "@/services/user";
import { setUser } from "@/app/stores/slices/userSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import TeamInviteModal from "../shared/TeamInviteModal";
import { acceptTeamInvitation } from "@/services/teams";
import { showToast } from "@/store/utils/toast";

export default function Layout({ children }) {
  const activeTab = useSelector((state) => state.sidebar.activeTab);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modeSwitching, setModeSwitching] = useState(false);
  const user = useSelector((state) => state.user.user);
  const profileImage = useSelector((state) => state.user.profile_image);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const invitedMemberId =
    searchParams.get("member_id") ||
    searchParams.get("memberId") ||
    searchParams.get("id");

  useEffect(() => {
    // If we have an invite ID and the user is logged in, show the modal
    if (invitedMemberId && user) {
      setShowInviteModal(true);
    }
  }, [invitedMemberId, user]);

  const handleAcceptInvite = async () => {
    try {
      setAccepting(true);
      await acceptTeamInvitation(invitedMemberId);
      showToast("success", "Invitation accepted successfully!");
      setShowInviteModal(false);
      
      // Clean up URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("member_id");
      newParams.delete("memberId");
      newParams.delete("id");
      setSearchParams(newParams);
    } catch (err) {
      console.error("Accept invite error:", err);
      showToast("error", err?.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setAccepting(false);
    }
  };

  const handleModeSwitchStart = useCallback(() => {
    setModeSwitching(true);
    setTimeout(() => setModeSwitching(false), 900);
  }, []);

  const getPageTitleFromPath = (path) => {
    switch (path) {
      case "/home":
        return "Home";
      case "/profiles":
        return "View Profiles";
      case "/edit-profile":
        return "Edit Profile";
      case "/profile-layout":
        return "Profile Layout";
      case "/devices":
        return "Devices";
      case "/contacts":
        return "Contacts";
      case "/teams":
        return "Teams";
      case "/teams/invite-members":
        return "Teams";
      case "/teams/templates":
        return "Templates";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      case "/products/manage-inventory":
        return "Digital Products";
      case "/products/sales-analytics":
        return "Sales Analytics";
      case "/products/order-list":
        return "Orders";
      case "/products/sales-analytics/transactions":
        return "Transactions";
      case "/payment-settings":
        return "Payment Settings";
      default:
        return "Home";
    }
  };

  const [pageTitle, setPageTitle] = useState(
    getPageTitleFromPath(location.pathname),
  );

  useEffect(() => {
    setPageTitle(getPageTitleFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F5F5F5] dark:bg-[#2A2A2A] text-white live-preview-scroll">
      {/* Full-page loading overlay for mode switch */}
      {modeSwitching && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#1a1a1a]/90 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
          <p className="text-white text-sm font-medium tracking-wide opacity-80">Switching mode…</p>
        </div>
      )}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => dispatch(setSidebarTab(tab))}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col  transition-all duration-300">
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          profileImage={profileImage}
          pageTitle={pageTitle}
          onModeSwitchStart={handleModeSwitchStart}
        />
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>

      <TeamInviteModal
        isOpen={showInviteModal}
        onOpenChange={setShowInviteModal}
        isAlreadyLoggedIn={true}
        onAccept={handleAcceptInvite}
        loading={accepting}
      />
    </div>
  );
}

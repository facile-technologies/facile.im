import { useSelector } from "react-redux";
import Profile from "./components/pages/Profile";
import DevicesPage from "./components/pages/Devices";
import ProfileEditPage from "./components/pages/ProfileEditPage";
import ProfileSection from "./components/General-Profile/layout/EditprofileLayout/ProfileSection";

export default function AppContent() {
  const activeTab = useSelector((state) => state.sidebar.activeTab);

  switch (activeTab) {
    case "profile":
      return <Profile />;
    case "edit-profile":
      return <ProfileSection />;
    case "analytics":
      return <h1 className="text-white text-2xl">Analytics Page</h1>;
    case "device":
      return <DevicesPage />;
    default:
      return <Profile />;
  }
}

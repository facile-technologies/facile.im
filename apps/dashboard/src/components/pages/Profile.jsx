import { useLocation } from "react-router-dom";
import ProfileSection from "../General-Profile/layout/EditprofileLayout/ProfileSection";
import SosProfileSection from "../SOS-Profile/layout/EditprofileLayout/SosProfileSection";
import PetProfileSection from "../Pet-Profile/layout/EditprofileLayout/PetProfileSection";

const Profile = () => {
  const location = useLocation();
  // If state was explicitly passed (including null), use it directly.
  // Only fall back to localStorage when navigating without any state.
  const profileLayout = location.state !== null && location.state !== undefined
    ? location.state.profileLayout
    : (localStorage.getItem("profileLayout") !== null
        ? Number(localStorage.getItem("profileLayout"))
        : null);

  const renderEditor = () => {
    switch (profileLayout) {
      case 0:
        return <SosProfileSection />;
      case 1:
        return <PetProfileSection />;
      case 2:
        return (
          <div>
            <h2 className="text-white text-2xl">Alpha Mode Profile</h2>
          </div>
        );
      default:
        return <ProfileSection />;
    }
  };

  return <div className="profile-container">{renderEditor()}</div>;
};

export default Profile;

import React, { useState, useEffect } from "react";
import { Plus, Loader2, User, Building2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfiles, deleteUserProfile } from "../../services/user";
import { useTheme } from "@/context/Themcontext";
import SelectProfileTypeModal from "../shared/SelectProfileTypeModal";
import defaultUserImage from "@/assets/pngs/default-user-2.jpg";
import ConfirmModal from "../shared/ConfirmModal";
import { showToast } from "@/store/utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { setProfileType } from "../../app/stores/slices/profileSlice";

export default function ProfileViewSwitcher() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const profileMode = useSelector((state) => state.user.profileMode);
  const isRescue = profileMode === "rescue";

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasSos = profiles.some((p) => p.type?.toLowerCase() === "sos");
  const hasPet = profiles.some((p) => p.type?.toLowerCase() === "pet");
  const allProfileTypesExist = hasSos && hasPet;
  const [showProfileTypeModal, setShowProfileTypeModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await getUserProfiles(isRescue ? "rescue" : undefined);
      if (response.data?.status === "success") {
        setProfiles(response.data.data || []);
      } else {
        console.error("Failed to load profiles", response.data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [isRescue]);

  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation();
    setProfileToDelete(profileId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!profileToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteUserProfile(profileToDelete);
      if (response.data?.success === true) {
        showToast("success", "Profile deleted successfully!");

        // Update local state immediately so users see the change even before the refetch completes
        setProfiles((prev) => prev.filter((p) => p.id !== profileToDelete));

        // If the deleted profile was the active one, clear it from localStorage
        if (localStorage.getItem("userProfileID") === profileToDelete) {
          localStorage.removeItem("userProfileID");
          localStorage.removeItem("profileType");
          localStorage.removeItem("profileMode");
        }

        await fetchProfiles();
      } else {
        showToast("error", response.data?.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      showToast("error", "An error occurred while deleting the profile.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setProfileToDelete(null);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-10 rounded-[20px] transition-colors duration-300 ${isDarkMode ? "bg-[#262626] text-white" : "bg-[#F9FAFB] text-black"}`}
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-semibold mb-1">View Profiles</h2>
          <p className={"text-sm text-gray-600 dark:text-[#FFFFFFA3]"}>
            Manage and switch between your digital identities
          </p>
        </div>
        {!allProfileTypesExist && (
          <button
            onClick={() => {
              setShowProfileTypeModal(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full !bg-black !text-white hover:bg-gray-800 transition text-sm font-medium"
          >
            <Plus size={18} />
            Create new profile
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <Loader2 className="animate-spin text-gray-500 w-10 h-10" />
        </div>
      ) : profiles.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center h-80 w-full text-center rounded-3xl border-2 border-dashed ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
        >
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg font-medium">
            You don't have any profiles yet.
          </p>
          <button
            onClick={() => navigate("/profile-layout")}
            className="px-8 py-3 rounded-full bg-black! text-white! hover:bg-gray-800 transition font-bold shadow-lg"
          >
            Create your first profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`group relative h-[400px] rounded-[32px] overflow-hidden flex flex-col justify-end p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode
                  ? "bg-[#3F3F3F] border border-white/5"
                  : "bg-white shadow-xl border border-gray-100"
                }`}
            >
              {/* Badge */}
              <div
                className={`absolute top-0 left-0 px-5 py-2.5 text-xs font-bold z-20 rounded-br-[24px] uppercase tracking-wider flex items-center gap-2 ${isDarkMode
                    ? "bg-[#262626] text-white"
                    : "bg-gray-100 text-black border-r border-b border-gray-200"
                  }`}
              >
                {profile.type === "business" ? (
                  <Building2 size={14} />
                ) : (
                  <User size={14} />
                )}
                {profile.type}
              </div>

              {/* Background Image / Phone Mockup */}
              <div className="absolute inset-0 z-0 bg-transparent flex justify-center">
                <div
                  className={`w-[90%] h-[95%] mt-4 rounded-t-[40px] overflow-hidden ${isDarkMode ? "bg-black/20" : "bg-gray-50"}`}
                >
                  <img
                    src={profile.image_url || defaultUserImage}
                    alt={profile.name}
                    className="w-full h-full object-contain object-top  pt-6  transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-t ${isDarkMode
                    ? "from-black via-black/80 to-transparent"
                    : "from-white via-white/95 to-transparent"
                  } bottom-0 h-[60%] mt-auto pointer-events-none z-10`}
              />


              {/* Action Buttons */}
              <div className="relative z-20 flex flex-col gap-3 mt-auto ">
                <button
                  onClick={() => {
                    const profileType = profile.type.toLowerCase();
                    localStorage.setItem("userProfileID", profile.id);
                    localStorage.setItem("profileType", profileType);
                    dispatch(setProfileType(profileType));

                    // Map profile type to profileLayout index for Profile.jsx routing
                    const layoutMap = { sos: 0, pet: 1 };
                    const profileLayout = layoutMap[profileType] ?? null;
                    if (profileLayout !== null) {
                      localStorage.setItem("profileLayout", String(profileLayout));
                    } else {
                      localStorage.removeItem("profileLayout");
                    }

                    navigate("/edit-profile", { state: { profileLayout } });
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] ${isDarkMode
                      ? "bg-white text-black hover:bg-gray-200 hover:scale-[1.02]"
                      : "bg-black text-white hover:bg-gray-800 shadow-md hover:scale-[1.02]"
                    }`}
                >
                  Edit Profile
                </button>
                <button
                  onClick={(e) => handleDeleteProfile(e, profile.id)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 ${isDarkMode
                      ? "!bg-black !text-white hover:bg-red-600 hover:text-white hover:scale-[1.02]"
                      : "bg-gray-100 text-gray-500 hover:bg-red-600 hover:text-white hover:scale-[1.02] border border-gray-200"
                    }`}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <SelectProfileTypeModal
        isOpen={showProfileTypeModal}
        onClose={() => setShowProfileTypeModal(false)}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete Profile?"
        message="Are you sure you want to delete this profile? This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setProfileToDelete(null);
          }
        }}
      />
    </div>
  );
}

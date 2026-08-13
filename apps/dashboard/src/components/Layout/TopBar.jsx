import { Menu, Search, MessageSquare, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProfileMode } from "@/app/stores/slices/userSlice";
import defaultUserImage from "@/assets/pngs/default-user-3.jpg";

export default function TopBar({
  sidebarOpen,
  setSidebarOpen,
  user,
  pageTitle,
  onModeSwitchStart,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const topbarProfileImage = useSelector(
    (state) => state.profile.profile.profile_image,
  );
  const sosProfileImg = useSelector((state) => state.sosprofile.profileImg);
  const petProfileImg = useSelector((state) => state.petprofile.profileImg);
  const profileMode = useSelector((state) => state.user.profileMode);
  const layout = localStorage.getItem("profileLayout");

  const getProfileImage = () => {
    switch (layout) {
      case "0":
        return sosProfileImg;
      case "1":
        return petProfileImg;
      case "3":
        return topbarProfileImage;
      default:
        return topbarProfileImage;
    }
  };

  const handleModeSwitch = () => {
    const next = profileMode === "network" ? "rescue" : "network";
    onModeSwitchStart?.();
    dispatch(setProfileMode(next));
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white dark:bg-[#262626] border-b border-[#ffffff05] z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 bg-[#000000]! dark:bg-[#2A2A2A]! rounded-lg"
        >
          <Menu size={24} color="#fff" />
        </button>
        {pageTitle.includes("Edit Profile") ? (
          <div className="text-[#000000] dark:text-white">
            <h2 className="text-lg font-semibold ">Edit Your Profile</h2>
            <div className="flex items-center gap-2 text-sm mt-1">
              <div className="text-xs  font-semibold text-[#FFFFFF85] p-1 w-20 bg-[#3F3F3F] rounded-full text-center ">
                Profiles
              </div>
              <span className="text-gray-400 font-bold">&gt;</span>
              <span className="text-gray-800 dark:text-white font-semibold">
                {user?.full_name}
              </span>
            </div>
          </div>
        ) : ["Digital Products", "Sales Analytics", "Orders", "Transactions", "Payment Settings"].includes(pageTitle) ? (
          <div className="text-[#000000] dark:text-white">
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            <div className="flex items-center gap-2 text-sm mt-0.5">
              <div className="text-[10px] font-bold text-[#FFFFFF85] px-3 py-1 bg-[#424242] rounded-[4px] text-center">
                {pageTitle === "Digital Products" ? "Products" : "Products"}
              </div>
              <span className="text-gray-400 font-bold">&gt;</span>
              <span className="text-gray-800 dark:text-white font-semibold">
                {pageTitle}
              </span>
            </div>
          </div>
        ) : (
          <h2 className="text-xl font-bold text-[#000000] dark:text-white tracking-tight">
            {pageTitle}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleModeSwitch}
          className="hidden md:block !bg-[#3F3F3F] hover:bg-[#4a4a4a] !text-white py-2 px-6 rounded-full text-sm font-normal transition-all border border-[#ffffff10]"
        >
          {profileMode === "network" ? "Switch to RescueID" : "Switch to Network"}
        </button>

        <div className="flex items-center gap-2">
          <button className="p-2.5 !bg-[#3F3F3F] rounded-full hover:bg-[#4a4a4a] transition-colors">
            <Search size={18} className="text-white opacity-80" />
          </button>
          <button className="p-2.5 !bg-[#3F3F3F] rounded-full hover:bg-[#4a4a4a] transition-colors">
            <MessageSquare size={18} className="text-white opacity-80" />
          </button>
          <button className="p-2.5 !bg-[#3F3F3F] rounded-full hover:bg-[#4a4a4a] transition-colors relative">
            <Bell size={18} className="text-white opacity-80" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#3F3F3F]"></span>
          </button>
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffffff10] cursor-pointer hover:border-white/20 transition-all">
          <img
            src={getProfileImage() || defaultUserImage}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

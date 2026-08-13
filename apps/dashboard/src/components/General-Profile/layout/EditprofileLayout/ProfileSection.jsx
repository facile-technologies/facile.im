"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Edit2Icon, QrCode, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import CustomAccordion from "@/components/shared/CustomAccordion";
import LinksSection from "@/components/General-Profile/Links/LinksSection";
import Loader from "@/store/utils/Loader";
import ImageCropModal from "./ImageCropModal";
import { showToast } from "@/store/utils/toast";
import QRCodeModal from "./QRCodeModal";

import { useDispatch, useSelector } from "react-redux";
import {
  setProfileField,
  setCropModal,
  setCropResult,
  setBg,
  setBlur,
  setTextColor,
  setFontFamily,
  saveProfile,
  setProfileShape,
  setLeadCapture,
  setFontSize,
  setbackGroundImage,
  fetchProfile,
  setProfileType,
  setProfileViewData,
  resetProfileState,
  hydrateProfile,
  createProfile,
  setActiveTab,
} from "@/app/stores/slices/profileSlice";

import {
  selectProfile,
  selectImages,
  selectCustom,
  selectCrop,
  selectLoading,
  selectCustomization,
} from "@/app/stores/selectors/profileSelectors";
import LivePreview from "@/components/General-Profile/layout/LivePreview";
import ContactSection from "@/components/General-Profile/Contact/Contactsecton";
import ECommerceSection from "@/components/General-Profile/Ecommerce/ECommerce";
import MediaSection from "@/components/General-Profile/Media/Mediasection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import QRCustomizerScreen from "@/components/shared/QRCustomizerScreen";
import Footer from "@/components/shared/Footer";
import { getUserProfile } from "@/services/user";
import { mapProfileViewResponseToState } from "@/lib/profileMapper";
import Assignee from "@/components/Teams/Templates/Create-Template/Assignee";

export default function ProfileSection() {
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const isNew = locationState?.isNew === true;
  const pathname = useSelector((state) => state.pagePath.pathname);
  console.log(pathname, "pathname");

  const profile = useSelector(selectProfile);
  console.log(profile, "profile");

  const profileType = useSelector((state) => state.profile.profileType);

  const { profile_image, logo, banner } = useSelector(selectImages);
  const { selectedBg, blur, fontFamily } = useSelector(selectCustom);
  const {
    user_profile_id,
    font_size,
    background_blur,
    about_text_color,
    font_family,
    background_color,
    background_image,
  } = useSelector(selectCustomization);
  const [showQRModal, setShowQRModal] = useState(false);
  const [imgpreview, setImgpreview] = useState(null);
  // const [templateName, setTemplateName] = useState("");
  const [lockTemplate, setLockTemplate] = useState(false);
  const { cropModalOpen, cropImageSrc, cropType, cropFor } =
    useSelector(selectCrop);
  const activeTab = useSelector((state) => state.profile.activeTab);
  const loading = useSelector(selectLoading);
  const usernemP = profile.username;
  const profileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const profileMode = localStorage.getItem("profileMode");
  const templateMode = localStorage.getItem("templateMode");

  const baseTabs = ["About", "Links", "Contact", "E-commerce", "Media"];

  // condition: change this according to your route logic
  const shouldShowAssignee = pathname.includes("teams");

  const tabs = shouldShowAssignee ? [...baseTabs, "Assignee"] : baseTabs;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileField({ name, value }));
  };

  const lastUpdate = profile.last_username_update;
  const canUpdateUsername =
    !lastUpdate ||
    (new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24) >= 30;
  const daysRemaining = lastUpdate
    ? Math.ceil(
        30 - (new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24),
      )
    : 0;

  useEffect(() => {
    const saved = localStorage.getItem("profileType");
    if (saved) dispatch(setProfileType(saved));
  }, [dispatch]);

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       // setIsloading(true);
  //       const response = await getUserProfile();
  //       const data = response.data;

  //       const mappedState = mapProfileViewResponseToState(data);

  //       // dispatch(setProfileViewData(mappedState));
  //       dispatch(hydrateProfile(mappedState));

  //       // setIsloading(false);
  //     } catch (error) {
  //       console.error("Failed to load profile", error);
  //     }
  //   };

  //   loadProfile();
  // }, [dispatch]);

  // useEffect(() => {
  //   localStorage.setItem("profileType", profileType);
  // }, [profileType]);
  // Use Redux profileType instead of reading directly from localStorage
  // const profileTypeLocalStorage = localStorage.getItem("profileType");
  // console.log(profileTypeLocalStorage, "profileTypeLocalStorage");

  const filesRef = useRef({
    profile: null,
    logo: null,
    banner: null,
    background: null,
  });

  const [removals, setRemovals] = useState({
    profile: false,
    logo: false,
    banner: false,
    background: false,
  });

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    filesRef.current[type] = file;
    setRemovals((prev) => ({ ...prev, [type]: false }));
    const previewUrl = URL.createObjectURL(file);
    dispatch(
      setCropModal({
        open: true,
        src: previewUrl,
        for: type,
        shape: type === "profile" || type === "logo" ? "circle" : "rect",
      }),
    );
    dispatch(
      setProfileField({
        name: type === "profile" ? "profile_image" : type,
        value: previewUrl,
      }),
    );
  };

  const handleRemoveImage = (type) => {
    filesRef.current[type] = null;
    setRemovals((prev) => ({ ...prev, [type]: true }));
    dispatch(
      setProfileField({
        name: type === "profile" ? "profile_image" : type,
        value: null,
      }),
    );
    if (type === "background") {
      dispatch(setbackGroundImage("none"));
    }
  };

  const handleEditClick = (imgSrc, type) => {
    setRemovals((prev) => ({ ...prev, [type]: false }));
    if (!imgSrc) {
      const map = {
        profile: profileInputRef,
        logo: logoInputRef,
        banner: bannerInputRef,
      };
      map[type].current?.click();
      return;
    }
    dispatch(
      setCropModal({
        open: true,
        src: imgSrc,
        type: type === "profile" || type === "logo" ? "circle" : "rect",
        for: type,
      }),
    );
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern API (HTTPS)
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback (HTTP or unsupported)
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      showToast("success", "Username copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("error", "Failed to copy");
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();

    // Text fields
    if (profileType === "personal" && !pathname.includes("template")) {
      formData.append("first_name", profile.first_name || "");
      formData.append("last_name", profile.last_name || "");
    }
    formData.append("username", profile.username || "");
    formData.append("bio", profile.bio || "");
    formData.append("about_text_color", about_text_color);
    formData.append("font_family", font_family);
    formData.append("font_size", font_size);
    formData.append("background_color", background_color);
    formData.append("background_blur", background_blur);

    if (filesRef.current.background && filesRef.current.background !== "none") {
      formData.append("backgroundImage", filesRef.current.background);
    }

    if (removals.background === true) {
      formData.append("remove_background_image", "true");
    }

    if (filesRef.current.banner && filesRef.current.banner instanceof File) {
      formData.append("banner", filesRef.current.banner);
    } else if (removals.banner) {
      formData.append("remove_banner", "true");
    }

    if (filesRef.current.profile && filesRef.current.profile instanceof File) {
      formData.append("profilePicture", filesRef.current.profile);
    } else if (removals.profile) {
      formData.append("remove_profile_image", "true");
    }

    if (filesRef.current.logo && filesRef.current.logo instanceof File) {
      formData.append("logo", filesRef.current.logo);
    } else if (removals.logo) {
      formData.append("remove_logo", "true");
    }

    if (
      profileType === "business" ||
      profileType === "storefront" ||
      pathname.includes("template")
    ) {
      formData.append("business_name", profile.business_name || "");
    }

    const isTemplatePage = pathname.includes("template");
    if (isTemplatePage) {
      formData.append("template_name", profile.template_name || "");
      formData.append("is_template_locked", lockTemplate);
      if (templateMode === "create") {
        dispatch(resetProfileState());
        dispatch(createProfile({ formData }));
      }
    }
    if (profileMode === "edit" || templateMode === "edit") {
      dispatch(saveProfile({ profileType: profileType, formData }));
    }
  };

  // const [isBusinessProfile, setIsBusinessProfile] = useState(false);

  const toggleBusinessProfile = (checked) => {
    const newType = checked ? "business" : "personal";
    dispatch(setProfileType(newType));
    localStorage.setItem("profileType", newType);
  };

  useEffect(() => {
    // Reset tab to "about" when entering or switching profile types
    dispatch(setActiveTab("about"));

    // Also reset on unmount to ensure a clean state for the next session
    return () => {
      dispatch(setActiveTab("about"));
    };
  }, [dispatch, profileType]);

  useEffect(() => {
    localStorage.setItem("profileLayout", "3");
    const isTemplatePage = pathname.includes("template");
    if (isTemplatePage) {
      if (templateMode === "edit") {
        dispatch(fetchProfile({}));
      } else {
        dispatch(resetProfileState());
      }
    } else {
      if (isNew) {
        dispatch(resetProfileState(profileType));
        dispatch(createProfile({ profileType: profileType }));
      } else {
        dispatch(fetchProfile({ profileType: profileType }));
      }
    }
  }, [dispatch, profileType, isNew, templateMode]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => dispatch(setCropModal({ open: false }))}
          image={cropImageSrc}
          type={cropFor}
          shape={
            cropFor === "profile" || cropFor === "logo" ? "circle" : "rect"
          }
          onCropComplete={(croppedFile) => {
            if (!croppedFile || !cropFor) return;
            filesRef.current[cropFor] = croppedFile;
            const previewUrl = URL.createObjectURL(croppedFile);
            const fieldName =
              cropFor === "profile"
                ? "profile_image"
                : cropFor === "logo"
                  ? "logo"
                  : "banner";

            dispatch(setProfileField({ name: fieldName, value: previewUrl }));

            dispatch(setCropModal({ open: false }));
          }}
        />
        {loading && <Loader />}
        {/* {isBusinessProfile ? (
          <BussinessProfileSection />
        ) : ( */}
        <>
          <div className="flex flex-col w-full p-4 md:p-6 bg-[#ffffff] dark:bg-[#262626] rounded-lg gap-8 transition-colors">
            <Tabs
              value={activeTab}
              onValueChange={(val) => dispatch(setActiveTab(val))}
              className="w-full"
            >
              <div className="bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-full py-1 w-full h-11">
                <TabsList className="flex justify-between rounded-full w-full cursor-pointer">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      asChild
                      key={tab}
                      value={tab.toLowerCase()}
                      className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300 rounded-full transition-all data-[state=active]:bg-black sm:data-[state=active]:h-11 data-[state=active]:h-9 data-[state=active]:text-white data-[state=active]:rounded-full"
                    >
                      <a>{tab}</a>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex flex-col lg:flex-row justify-between gap-8 mt-6 w-full relative">
                <div className="flex flex-col flex-1 min-w-0 gap-6 ">
                  <TabsContent value="about">
                    <div className="flex flex-col gap-4 bg-[#F5F5F5] dark:bg-[#3F3F3F] rounded-2xl p-4 md:p-6 transition-colors">
                      {pathname.includes("template") ? (
                        <div className="w-full mt-1 flex justify-between gap-2">
                          <Input
                            placeholder="Enter Template Name"
                            value={profile.template_name || ""}
                            onChange={(e) =>
                              dispatch(
                                setProfileField({
                                  name: "template_name",
                                  value: e.target.value,
                                }),
                              )
                            }
                            className="bg-[#FAFAFA] dark:bg-[#373636] w-full border-none! rounded-2xl h-[59px] text-black dark:text-white transition-colors placeholder:text-[#C0C0C0]"
                          />

                          {/* <div className="flex items-center justify-between w-full h-[59px] bg-white dark:bg-[#373636]  rounded-2xl px-6 shadow-sm">
                            <Label
                              htmlFor="lock-template"
                              className=" font-medium text-black dark:text-white select-none cursor-pointer"
                            >
                              Lock Template
                            </Label>
                            <Switch
                              id="lock-template"
                              checked={lockTemplate}
                              onCheckedChange={setLockTemplate}
                            />
                          </div> */}
                        </div>
                      ) : (
                        <div className="w-full mt-1">
                          {/* <div className="flex items-center justify-between w-full h-[59px] bg-white dark:bg-[#3A3A3A] rounded-2xl px-6 shadow-sm">
                          <Label
                            htmlFor="business-toggle"
                            className="text-base font-medium text-black dark:text-white select-none cursor-pointer"
                          >
                            Business Profile
                          </Label>
                          <Switch
                            id="business-toggle"
                            checked={isBusinessProfile}
                            onCheckedChange={toggleBusinessProfile}
                          />
                        </div> */}
                          <div className="flex items-center h-[59px] bg-white dark:bg-[#3A3A3A] rounded-2xl px-6 shadow-sm text-black dark:text-white">
                            <h2>
                              {" "}
                              {profileType.charAt(0).toUpperCase() +
                                profileType.slice(1)}{" "}
                              Profile
                            </h2>
                          </div>
                        </div>
                      )}
                      {console.log(profile, "profile")}

                      <div className="flex flex-row items-center gap-2 justify-between">
                        {[
                          {
                            img: profile.profile_image || imgpreview,
                            label: "Profile Picture",
                            ref: profileInputRef,
                            type: "profile",
                          },
                          {
                            img: profile.logo || imgpreview,
                            label: "Logo",
                            ref: logoInputRef,
                            type: "logo",
                          },
                          {
                            img: profile.banner,
                            label: "Banner",
                            ref: bannerInputRef,
                            type: "banner",
                            isBanner: true,
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`relative ${
                              item.isBanner
                                ? "w-full sm:w-[303px] h-[124px]"
                                : "w-[124px] h-[124px]"
                            }`}
                          >
                            {item.img ? (
                              <img
                                src={item.img}
                                alt={item.label.toLowerCase()}
                                loading="lazy"
                                className={`w-full h-full ${
                                  item.isBanner ? "rounded-lg" : "rounded-full"
                                } object-cover`}
                              />
                            ) : (
                              <div
                                className={`flex items-center justify-center font-normal text-sm ${
                                  item.isBanner
                                    ? "w-full h-full rounded-lg bg-gray-400 dark:bg-[#7B7B7B]"
                                    : "w-full h-full rounded-full bg-gray-400 dark:bg-[#7B7B7B]"
                                }`}
                              >
                                {item.label}
                              </div>
                            )}
                            <div
                              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                              onClick={() => item.ref.current?.click()}
                            >
                              <Edit2Icon className="text-white" size={22} />
                            </div>
                            <a
                              type="button"
                              className={`absolute bg-black dark:bg-[#000000] p-1.5 rounded-full ${
                                item.label === "Logo" ||
                                item.label === "Profile Picture" ||
                                item.label === "Banner"
                                  ? "bottom-2 right-2"
                                  : "top-2 right-2"
                              } z-10 flex gap-2`}
                            >
                              <Edit2Icon
                                size={16}
                                className="text-white cursor-pointer"
                                onClick={() =>
                                  handleEditClick(item.img, item.type)
                                }
                              />
                              {(item.img ||
                                (item.type === "profile"
                                  ? profile.profile_image
                                  : item.type === "logo"
                                    ? profile.logo
                                    : profile.banner)) && (
                                <X
                                  size={16}
                                  className="text-white cursor-pointer border-l border-gray-600 pl-1"
                                  onClick={() => handleRemoveImage(item.type)}
                                />
                              )}
                            </a>
                            <input
                              type="file"
                              accept="image/*"
                              ref={item.ref}
                              onChange={(e) => handleImageUpload(e, item.type)}
                              className="hidden"
                            />
                          </div>
                        ))}
                      </div>
                      {profileType === "business" ||
                      profileType === "storefront" ||
                      pathname.includes("template") ? (
                        <div>
                          <label className="flex text-sm mb-2 text-[#000000] dark:text-[#FFFFFF] capitalize">
                            Business Name
                          </label>
                          <Input
                            name="business_name"
                            value={profile.business_name}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#373636] w-full border-none rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="flex text-sm mb-2 text-[#000000] dark:text-[#FFFFFF] capitalize">
                              First Name
                            </label>
                            <Input
                              name="first_name"
                              value={profile.first_name}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#373636] w-full border-none rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            />
                          </div>
                          <div>
                            <label className="flex text-sm mb-2 text-[#000000] dark:text-[#FFFFFF] capitalize">
                              Last Name
                            </label>
                            <Input
                              name="last_name"
                              value={profile.last_name}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#373636] w-full border-none rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            />
                          </div>
                        </>
                      )}
                      {!pathname.includes("template") && (
                        <div className="relative">
                          <label className="flex text-sm mb-2 text-[#000000] dark:text-[#FFFFFF] capitalize">
                            Username
                          </label>
                          <div
                            className="relative flex items-center w-full"
                            title={
                              !canUpdateUsername
                                ? `You can change your username in ${daysRemaining} days`
                                : ""
                            }
                          >
                            <span className="absolute left-4 text-gray-400 select-none pointer-events-none ml-[-4px]">
                              facile.im/
                            </span>
                            <Input
                              name="username"
                              value={profile.username || ""}
                              onChange={handleChange}
                              readOnly={!canUpdateUsername}
                              className={`bg-transparent border border-gray-300 dark:border-gray-600 dark:bg-[#3b3b3b] w-full rounded-2xl h-[55px] pr-24 pl-20 text-black dark:text-white shadow-none ${
                                !canUpdateUsername
                                  ? "text-gray-500 dark:text-gray-300 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                            <div className="absolute right-2 flex gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  copyToClipboard(
                                    `facile.im/${profile.username}`,
                                  );
                                  showToast(
                                    "success",
                                    "Username copied to clipboard",
                                  );
                                }}
                                className="bg-black! text-white! p-2 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-800 transition"
                              >
                                <Copy size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowQRModal(true);
                                }}
                                className="bg-black! text-white! p-2 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-800 transition"
                              >
                                <QrCode size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="flex text-sm mb-2 text-[#000000] dark:text-[#FFFFFF] capitalize">
                          Bio
                        </label>
                        <Textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleChange}
                          className="bg-[#FAFAFA] dark:bg-[#373636] w-full border-none rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                        />
                      </div>

                      <CustomAccordion
                        onBgChange={(v) => dispatch(setBg(v))}
                        onBlurChange={(v) => dispatch(setBlur(v))}
                        onBackgorundImgChange={(v) => {
                          if (!v) return;
                          filesRef.current.background = v.file || null;
                          setRemovals((prev) => ({
                            ...prev,
                            background: v.url === "none",
                          }));
                          dispatch(setbackGroundImage(v.url || "none"));
                        }}
                        onTextColorChange={(v) => dispatch(setTextColor(v))}
                        onFontChange={(v) => dispatch(setFontFamily(v))}
                        backgroundInputRef={backgroundInputRef}
                        onFontSizeChange={(v) => dispatch(setFontSize(v))}
                        blurValue={background_blur}
                        currentBgImage={background_image}
                        currentBgColor={background_color}
                        currentTextColor={about_text_color}
                      />
                    </div>
                    <Footer onSave={handleUpdateProfile} />
                  </TabsContent>
                  <TabsContent value="links">
                    <LinksSection />
                  </TabsContent>
                  <TabsContent value="contact">
                    <ContactSection />
                  </TabsContent>
                  <TabsContent value="e-commerce">
                    <ECommerceSection />
                  </TabsContent>
                  <TabsContent value="media">
                    <MediaSection />
                  </TabsContent>
                  <TabsContent value="assignee">
                    <Assignee />
                  </TabsContent>
                </div>
                <div className=" sticky top-0 self-start h-fit">
                  <LivePreview />
                </div>
              </div>
            </Tabs>
          </div>
        </>
        {/* )}{" "} */}
      </div>
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        username={profile.username}
        profileImage={profile.profile_image}
        userProfileId={user_profile_id}
      />
    </>
  );
}

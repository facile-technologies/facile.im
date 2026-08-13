"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Edit2Icon, QrCode, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import CustomAccordion from "@/components/shared/CustomAccordion";
import LinksSection from "@/components/General-Profile/Links/LinksSection";
import Loader from "@/store/utils/Loader";
import ImageCropModal from "./ImageCropModal";

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

export default function ProfileSection() {
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);
  const profileType = useSelector((state) => state.profile.profileType);
  const isBusinessProfile = profileType === "business";

  const { profile_image, logo, banner } = useSelector(selectImages);
  const { selectedBg, blur, fontFamily } = useSelector(selectCustom);
  const {
    font_size,
    background_blur,
    about_text_color,
    font_family,
    background_color,
    background_image,
  } = useSelector(selectCustomization);
  const [showQRModal, setShowQRModal] = useState(false);
  const [imgpreview, setImgpreview] = useState(null);

  const { cropModalOpen, cropImageSrc, cropType, cropFor } =
    useSelector(selectCrop);
  const activeTab = useSelector((state) => state.profile.activeTab);
  const loading = useSelector(selectLoading);
  const usernemP = profile.username;
  const profileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileField({ name, value }));
  };

  // useEffect(() => {
  //   const saved = localStorage.getItem("profileType");
  //   if (saved) dispatch(setProfileType(saved));
  // }, [dispatch]);

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

  useEffect(() => {
    const saved = localStorage.getItem("profileType");
    if (saved) dispatch(setProfileType(saved));
  }, [dispatch]);

  // useEffect(() => {
  //   localStorage.setItem("profileType", profileType);
  // }, [profileType]);

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
        type: type === "profile" ? "round" : "rect",
        for: type,
      }),
    );
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();

    // Text fields
    if (profileType === "personal") {
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

    if (filesRef.current.background instanceof File) {
      formData.append("backgroundImage", filesRef.current.background);
    } else if (background_image && background_image !== "none") {
      formData.append("backgroundImage", background_image);
    }

    if (removals.background || background_image === "none") {
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

    if (profileType === "business") {
      formData.append("business_name", profile.business_name || "");
    }

    dispatch(saveProfile({ profileType, formData }));
  };

  // const [isBusinessProfile, setIsBusinessProfile] = useState(false);

  const toggleBusinessProfile = (checked) => {
    dispatch(setProfileType(checked ? "business" : "personal"));
  };

  useEffect(() => {
    localStorage.setItem("profileLayout", "3");

    dispatch(resetProfileState()); // 👈 CRITICAL
    dispatch(fetchProfile({ profileType }));
  }, [profileType, dispatch]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full max-w-[1200px] mx-auto">
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => dispatch(setCropModal({ open: false }))}
          image={cropImageSrc}
          type={cropFor}
          shape={cropFor === "profile" ? "circle" : "square"}
          onShapeChange={(s) => dispatch(setProfileShape(s))}
          onCropComplete={(croppedFile, finalShape) => {
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
            if (cropFor === "profile") {
              dispatch(setProfileShape(finalShape));
            }
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
              <div className="bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-full py-1 w-full max-w-[1100px] h-11 mx-auto">
                <TabsList className="flex justify-between rounded-full w-full cursor-pointer">
                  {["About", "Links", "Contact", "E-commerce", "Media"].map(
                    (tab) => (
                      <TabsTrigger
                        asChild
                        key={tab}
                        value={tab.toLowerCase()}
                        className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300 rounded-full transition-all data-[state=active]:bg-black sm:data-[state=active]:h-11 data-[state=active]:h-9 data-[state=active]:text-white data-[state=active]:rounded-full"
                      >
                        <a>{tab}</a>
                      </TabsTrigger>
                    ),
                  )}
                </TabsList>
              </div>

              <div className="flex flex-col lg:flex-row justify-between gap-8 mt-6 w-full relative">
                <div className="flex flex-col flex-1 min-w-0 gap-6">
                  <TabsContent value="about">
                    <div className="flex flex-col gap-4 bg-[#F5F5F5] dark:bg-[#3F3F3F] rounded-2xl p-4 md:p-6 transition-colors">
                      <div className="w-full mt-1">
                        <div className="flex items-center justify-between w-full h-[59px] bg-white dark:bg-[#373636]  rounded-2xl px-6 shadow-sm">
                          <Label
                            htmlFor="allow-edit-profile"
                            className=" font-medium text-black dark:text-white select-none cursor-pointer"
                          >
                            Allow user to edit profile
                          </Label>
                          <Switch id="allow-edit-profile" />
                        </div>
                      </div>
                      {console.log(profile, "profile")}

                      <div className="flex flex-row items-center gap-2">
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

                      <div className="relative">
                        <label className="flex text-sm mb-2 text-[#000000] dark:text-[#FFFFFF] capitalize">
                          Username
                        </label>
                        <Input
                          name="username"
                          value={profile.username}
                          readOnly
                          className="bg-[#E5E5E5] dark:bg-[#555] w-full border-none rounded-2xl h-[55px] pr-20 text-black dark:text-white cursor-not-allowed"
                        />
                      </div>

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
                          filesRef.current.background = v.file || v.url;
                          setRemovals((prev) => ({
                            ...prev,
                            background: v.url === "none",
                          }));
                          dispatch(setbackGroundImage(v.url));
                        }}
                        onTextColorChange={(v) => dispatch(setTextColor(v))}
                        onFontChange={(v) => dispatch(setFontFamily(v))}
                        backgroundInputRef={backgroundInputRef}
                        onFontSizeChange={(v) => dispatch(setFontSize(v))}
                        blurValue={background_blur}
                        currentBgImage={background_image}
                        currentBgColor={background_color}
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
    </>
  );
}

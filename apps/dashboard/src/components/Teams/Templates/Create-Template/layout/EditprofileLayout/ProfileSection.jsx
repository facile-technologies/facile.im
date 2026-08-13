import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Edit2Icon, QrCode } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import CustomAccordion from "@/components/shared/CustomAccordion";
import LinksSection from "@/components/General-Profile/Links/LinksSection";
import Loader from "@/store/utils/Loader";
import ImageCropModal from "./ImageCropModal";

import { useDispatch, useSelector } from "react-redux";
import {
  setProfileField,
  setCropModal,
  setBg,
  setBlur,
  setTextColor,
  setFontFamily,
  saveProfile,
  setProfileShape,
  setFontSize,
  setbackGroundImage,
  fetchProfile,
  resetProfileState,
} from "@/app/stores/slices/profileSlice";

import {
  selectProfile,
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

import Footer from "@/components/shared/Footer";
import Assignee from "../../Assignee";

export default function TeamsProfileSection() {
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);
  const profileType = useSelector((state) => state.profile.profileType);

  const {
    font_size,
    background_blur,
    about_text_color,
    font_family,
    background_color,
  } = useSelector(selectCustomization);

  const { cropModalOpen, cropImageSrc, cropFor } = useSelector(selectCrop);
  const loading = useSelector(selectLoading);

  const profileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileField({ name, value }));
  };

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

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    filesRef.current[type] = file;
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
        name: `${type}_image`,
        value: previewUrl,
      }),
    );
  };

  const handleEditClick = (imgSrc, type) => {
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

    formData.append("bio", profile.bio || "");
    formData.append("about_text_color", about_text_color);
    formData.append("font_family", font_family);
    formData.append("font_size", font_size);
    formData.append("background_color", background_color);
    formData.append("background_blur", background_blur);

    if (
      filesRef.current.background &&
      filesRef.current.background instanceof File
    ) {
      formData.append("background_image", filesRef.current.background);
    }

    if (filesRef.current.banner && filesRef.current.banner instanceof File) {
      formData.append("banner", filesRef.current.banner);
    }

    if (filesRef.current.profile && filesRef.current.profile instanceof File) {
      formData.append("profilePicture", filesRef.current.profile);
    }

    if (filesRef.current.logo && filesRef.current.logo instanceof File) {
      formData.append("logo", filesRef.current.logo);
    }

    formData.append("business_name", profile.business_name || "");

    dispatch(saveProfile({ profileType, formData }));
  };

  useEffect(() => {
    localStorage.setItem("profileLayout", "3");

    dispatch(resetProfileState()); // 👈 CRITICAL
    dispatch(fetchProfile({ profileType }));
  }, [profileType, dispatch]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
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

        <>
          <div className="flex flex-col w-full p-4 md:p-6 bg-[#ffffff] dark:bg-[#262626] rounded-lg gap-8 transition-colors">
            <Tabs defaultValue="about" className="w-full">
              <div className="bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-full py-1 w-full h-11">
                <TabsList className="flex justify-between rounded-full w-full cursor-pointer">
                  {[
                    "About",
                    "Links",
                    "Contact",
                    "E-commerce",
                    "Media",
                    "Assignee",
                  ].map((tab) => (
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

              <div className="flex flex-col lg:flex-row justify-between gap-4 mt-6 w-full relative">
                <div className="flex flex-col w-full  gap-6">
                  <TabsContent value="about">
                    <div className="flex flex-col gap-4 bg-[#F5F5F5] dark:bg-[#3F3F3F] rounded-2xl p-4 md:p-6 transition-colors">
                      <div className="w-full mt-1 flex justify-between gap-2">
                        <Input
                          placeholder="Enter Template Name"
                          className="bg-[#FAFAFA] dark:bg-[#373636] w-full border-none! rounded-2xl h-[59px] text-black dark:text-white transition-colors placeholder:text-[#C0C0C0]"
                        />

                        <div className="flex items-center justify-between w-full h-[59px] bg-white dark:bg-[#373636]  rounded-2xl px-6 shadow-sm">
                          <Label
                            htmlFor="lock-template"
                            className=" font-medium text-black dark:text-white select-none cursor-pointer"
                          >
                            Lock Template
                          </Label>
                          <Switch id="lock-template" />
                        </div>
                      </div>
                      {console.log(profile, "profile")}

                      <div className="flex flex-row items-center gap-2 justify-between">
                        {[
                          {
                            img: profile.profile_image,
                            label: "Profile Picture",
                            ref: profileInputRef,
                            type: "profile",
                          },
                          {
                            img: profile.logo,
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
                              } z-10`}
                              onClick={() =>
                                handleEditClick(item.img, item.type)
                              }
                            >
                              <Edit2Icon size={16} className="text-white" />
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
                        onBackgorundImgChange={(v) =>
                          dispatch(setbackGroundImage(v))
                        }
                        onTextColorChange={(v) => dispatch(setTextColor(v))}
                        onFontChange={(v) => dispatch(setFontFamily(v))}
                        backgroundInputRef={backgroundInputRef}
                        onFontSizeChange={(v) => dispatch(setFontSize(v))}
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
    </>
  );
}

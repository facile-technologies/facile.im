"use client";
import { useEffect, useRef, useState } from "react";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Edit2Icon, Pin, PinIcon, PinOff, QrCode } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import CustomAccordion from "@/components/shared/CustomAccordion";
import Loader from "@/store/utils/Loader";
import ImageCropModal from "./ImageCropModal";

const ContactSection = lazy(() => import("../../Contact/Contactsecton"));
const MedicalInformation = lazy(
  () => import("../../MedicalInfo/MedicalInformation"),
);
import { useDispatch, useSelector } from "react-redux";
import {
  setProfileField,
  setCropModal,
  setCropResult,
  setBg,
  setBlur,
  setTextColor,
  setFontFamily,
  setProfileShape,
  setBgImage,
  setProfileImage,
  resetSOSProfile,
} from "@/app/stores/slices/sosprofileSlice";

import {
  selectImages,
  selectCustom,
  selectLoading,
} from "@/app/stores/selectors/profileSelectors";
import QRCustomizerScreen from "@/components/shared/QRCustomizerScreen";
import SosLivePreview from "../../SosLivePreview";
import { setPinOn } from "@/app/stores/slices/sosprofileSlice";
import {
  selectCrop,
  selectSOSLoading,
  selectSOSPreviewCustom,
  selectSOSProfile,
} from "@/app/stores/selectors/sosProfileSelector";
import { showToast } from "@/store/utils/toast";
import PetprofileEdit from "@/components/pages/PetprofileEdit";
import Footer from "@/components/shared/Footer";
import DatePickerInput from "@/components/shared/DatePickerInput";
import {
  fetchSOSProfile,
  saveSOSProfile,
} from "@/app/stores/slices/Sosprofile/thunk";

export default function SosProfileSection() {
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const isNew = locationState?.isNew === true;

  const profile = useSelector(selectSOSProfile);
  const layout = useSelector((state) => state.sosprofile.layout);
  const { selectedBg, blur, textColor, fontFamily } = useSelector(
    selectSOSPreviewCustom,
  );
  const profileImgPreview = useSelector(
    (state) => state.sosprofile.profileImgPreview,
  );
  const [showQRModal, setShowQRModal] = useState(false);
  const profileImg = useSelector((state) => state.sosprofile.profileImg);
  const backgroundImage = useSelector(
    (state) => state.sosprofile.customization.backgroundImage,
  );
  const backgroundColor = useSelector(
    (state) => state.sosprofile.customization.backgroundColor,
  );
  const shouldRemoveBgImage = useSelector(
    (state) => state.sosprofile.shouldRemoveBgImage,
  );
  const blurLevel = useSelector(
    (state) => state.sosprofile.customization.blurLevel,
  );
  const { cropModalOpen, cropImageSrc, cropType, cropFor } =
    useSelector(selectCrop);
  const loading = useSelector(selectSOSLoading);

  const platformLinks = useSelector(
    (state) => state.profile.platformLinks || [],
  );

  const profileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      dispatch(resetSOSProfile());
    } else {
      dispatch(fetchSOSProfile());
    }
  }, [dispatch, isNew]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (profile.firstName) formData.append("first_name", profile.firstName);
      if (profile.lastName) formData.append("last_name", profile.lastName);
      if (profile.profilePicture)
        formData.append("profilePicture", profile.profilePicture);
      if (profile.gender) formData.append("gender", profile.gender);
      if (profile.birthday) formData.append("dob", profile.birthday);
      if (profile.height) formData.append("height", profile.height);
      if (profile.weight) formData.append("weight", profile.weight);
      if (layout) formData.append("layout", layout);
      if (profile.bloodGroup)
        formData.append("blood_group", profile.bloodGroup);
      if (profile.important)
        formData.append("important_note", profile.important);
      formData.append("note_is_pinned", profile.isPinned ? "true" : "false");
      if (profile.username) formData.append("username", profile.username);
      if (profile.bio) formData.append("bio", profile.bio);
      if (textColor) formData.append("about_text_color", textColor);
      if (fontFamily) formData.append("font_family", fontFamily);
      if (profile.fontSize) formData.append("font_size", profile.fontSize);
      if (selectedBg) formData.append("background_color", selectedBg);
      if (backgroundImage?.startsWith("blob:")) {
        const res = await fetch(backgroundImage);
        const blob = await res.blob();
        const file = new File([blob], "background.png", { type: blob.type });
        formData.append("backgroundImage", file);
      } else if (shouldRemoveBgImage) {
        formData.append("remove_background_image", "true");
      }
      if (blurLevel !== undefined && blurLevel !== null)
        formData.append("background_blur", blurLevel);

      if (profileImg) formData.append("profilePicture", profileImg);
      await dispatch(saveSOSProfile(formData));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProfileField({ name, value }));
  };
  const isPinned = profile.isPinned;
  const handlePinClick = () => {
    dispatch(setPinOn(!isPinned));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "File size should not exceed 2MB.");
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      showToast(
        "error",
        "Invalid file type. Please upload a PNG or JPG image.",
      );
      return;
    }

    // Create a preview URL for the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result;
      dispatch(setProfileImage({ file, previewUrl: url })); // Save the file and preview URL to Redux
      dispatch(
        setCropModal({
          open: true,
          src: url, // Send preview URL to the crop modal
          type: type === "profile" ? "round" : "rect",
          for: type,
        }),
      );
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (imgSrc, type) => {
    if (!imgSrc) {
      const map = {
        profile: profileInputRef,
      };
      map[type].current?.click();
      return;
    }
    dispatch(
      setCropModal({
        open: true,
        src: imgSrc,
        type: type === "profile",
        for: type,
      }),
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => dispatch(setCropModal({ open: false }))}
          image={cropImageSrc}
          shape={cropType}
          onShapeChange={(s) => dispatch(setProfileShape(s))}
          onCropComplete={(cropped) => {
            dispatch(setCropResult({ type: cropFor, url: cropped }));

            dispatch(setCropModal({ open: false }));
          }}
        />
        <div className="flex flex-col w-full p-4 md:p-6 bg-[#ffffff] dark:bg-[#262626] rounded-lg gap-8 transition-colors">
          <Tabs defaultValue="about" className="w-full">
            <div className="bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-full py-1 w-full h-11">
              <TabsList className="flex justify-between rounded-full w-full">
                {["About", "Contact", "Medical Information"].map((tab) => (
                  <TabsTrigger
                    asChild
                    key={tab}
                    value={tab.toLowerCase()}
                    className="flex-1 text-center  text-sm font-medium text-gray-700 dark:text-gray-300 rounded-full transition-all data-[state=active]:bg-black sm:data-[state=active]:h-11 data-[state=active]:h-9 data-[state=active]:text-white data-[state=active]:rounded-full"
                  >
                    <a>{tab}</a>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-4 mt-6 w-full relative">
              <div className="flex flex-col flex-1 min-w-0 gap-6">
                <TabsContent value="about">
                  <div className="flex flex-col gap-4 bg-[#F5F5F5] dark:bg-[#303030] rounded-2xl p-4 md:p-6 transition-colors mb-2">
                    <div className="flex justify-center">
                      <div className="relative w-[120px] h-[120px] group">
                        {/* Image / Placeholder */}
                        {profileImgPreview ? (
                          // Display the preview image with crop functionality
                          <img
                            src={profileImgPreview} // Use the temporary preview URL
                            alt="profile"
                            className="w-full h-full rounded-full object-cover"
                            onClick={() =>
                              handleEditClick(profileImgPreview, "profile")
                            } // Trigger cropping when preview is clicked
                          />
                        ) : profileImg ? (
                          <img
                            src={profileImg} // Fallback to the saved profile image from Redux
                            alt="profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#7B7B7B] flex items-center justify-center text-white">
                            Profile
                          </div>
                        )}

                        <div
                          className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                          onClick={() => profileInputRef.current?.click()}
                        >
                          <Edit2Icon className="text-white" size={22} />
                        </div>

                        {/* ✅ Your existing bottom-right icon (stays same) */}
                        <a
                          type="button"
                          onClick={() => handleEditClick(profileImg, "profile")}
                          className="absolute bottom-2 right-2 bg-black p-2 rounded-full shadow-md z-10"
                        >
                          <Edit2Icon size={16} className="text-white" />
                        </a>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={profileInputRef}
                        onChange={(e) => handleImageUpload(e, "profile")}
                        className="hidden"
                      />
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 text-white capitalize block">
                            First Name
                          </label>
                          <Input
                            name="firstName"
                            value={profile?.firstName || ""}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full  border-opacity-35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-sm mb-2 text-white block">
                            Last Name
                          </label>
                          <Input
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-[#ffffff] border-opacity-35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 text-white capitalize block">
                            Gender
                          </label>
                          <Input
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-[#ffffff] border-opacity-35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 text-white capitalize block">
                            Birthday
                          </label>
                          <DatePickerInput
                            name="birthday"
                            value={profile.birthday}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-[#ffffff] border-opacity-35 rounded-2xl h-[55px] px-4 text-black dark:text-white transition-colors"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 text-white capitalize block">
                            Height
                          </label>
                          <Input
                            name="height"
                            value={profile.height}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-[#ffffff] border-opacity-35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 text-white capitalize block">
                            Weight
                          </label>
                          <Input
                            name="weight"
                            value={profile.weight}
                            onChange={handleChange}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-[#ffffff] border-opacity-35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-col  gap-4">
                        <div>
                          <label className="text-sm mb-2 text-white capitalize block">
                            Blood Group
                          </label>
                          <Input
                            name="bloodGroup"
                            value={profile.bloodGroup}
                            onChange={handleChange}
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            }}
                            className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-[#ffffff] border-opacity-35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 text-white block">
                          Important
                        </label>
                        <div className="relative">
                          <Textarea
                            name="important"
                            value={profile.important}
                            onChange={handleChange}
                            className="bg-[#4F4C4C3B] border border-[#ffffff] border-opacity-35 rounded-xl w-full min-h-20 p-3 text-white resize-none"
                          />
                          <a
                            type="button"
                            onClick={handlePinClick}
                            className="absolute top-2 right-2 text-white"
                            aria-label="Pin Important Note"
                          >
                            {isPinned ? (
                              <Pin size={20} className="rotate-45" />
                            ) : (
                              <PinOff size={20} className="rotate-45" />
                            )}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CustomAccordion
                    onBgChange={(v) => dispatch(setBg(v))}
                    onBlurChange={(v) => dispatch(setBlur(v))}
                    onTextColorChange={(v) => dispatch(setTextColor(v))}
                    onFontChange={(v) => dispatch(setFontFamily(v))}
                    backgroundInputRef={backgroundInputRef}
                    onBackgorundImgChange={(v) => dispatch(setBgImage(v))}
                    blurValue={blurLevel}
                    currentBgColor={backgroundColor}
                    currentBgImage={backgroundImage}
                  />
                  <Footer onSave={handleSave} loading={loading} />
                </TabsContent>
                <TabsContent value="contact">
                  <Suspense fallback={<Loader />}>
                    <ContactSection />
                  </Suspense>
                </TabsContent>
                <TabsContent value="medical information">
                  <Suspense fallback={<Loader />}>
                    <MedicalInformation />
                  </Suspense>
                </TabsContent>
              </div>
              <div className=" sticky top-0 self-start h-fit">
                <SosLivePreview />
              </div>
            </div>
          </Tabs>
          {showQRModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="w-full max-w-5xl mx-4 ml-70">
                <QRCustomizerScreen />
                <a
                  type="button"
                  className="absolute top-3 right-3 text-white text-2xl font-bold"
                  onClick={() => setShowQRModal(false)}
                >
                  ×
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

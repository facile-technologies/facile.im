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
import {
  selectImages,
  selectCustom,
  selectCrop,
  selectLoading,
} from "@/app/stores/selectors/profileSelectors";
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
  setFontSize,
  fetchPETProfile,
  savePETProfile,
  resetPETProfile,
  setBgImage,
} from "@/app/stores/slices/petprofileSlice";
import QRCustomizerScreen from "@/components/shared/QRCustomizerScreen";
import { setPinOn } from "@/app/stores/slices/petprofileSlice";

import {
  selectPetCrop,
  selectPetProfile,
} from "@/app/stores/selectors/petProfileSelector";
import { showToast } from "@/store/utils/toast";
import Identification from "../../Identification/Identification";
import PetLivePreview from "../../PetLivePreview";
import Footer from "@/components/shared/Footer";

export default function PetProfileSection() {
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const isNew = locationState?.isNew === true;
  const layout = useSelector((state) => state.petprofile.customization.layout);
  // const { selectedBg, blur, textColor, fontFamily } = useSelector(selectCustom);
  const customization = useSelector((state) => state.petprofile.customization);
  const shouldRemoveBgImage = useSelector(
    (state) => state.petprofile.shouldRemoveBgImage,
  );

  const profile = useSelector(selectPetProfile);

  const [showQRModal, setShowQRModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileImg = useSelector((state) => state.petprofile.profileImg);
  const profileShape = useSelector((state) => state.petprofile.profileShape);
  const { cropModalOpen, cropImageSrc, cropType, cropFor } =
    useSelector(selectPetCrop);
  const loading = useSelector(selectLoading);

  const platformLinks = useSelector(
    (state) => state.profile.platformLinks || [],
  );

  const profileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  useEffect(() => {
    if (isNew) {
      dispatch(resetPETProfile());
    } else {
      dispatch(fetchPETProfile());
    }
  }, [dispatch, isNew]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      // Only append non-null and non-undefined fields

      if (profile.pet_name) formData.append("pet_name", profile.pet_name);
      // if (profile.profilePicture)
      //   formData.append("profilePicture", profile.profilePicture);
      // ✅ send Blob for API
      if (
        profile.profileImg instanceof File ||
        profile.profileImg instanceof Blob
      ) {
        formData.append("profilePicture", profile.profileImg);
      }
      if (profile.gender) formData.append("gender", profile.gender);
      if (profile.breed) formData.append("breed", profile.breed);
      if (profile.age) formData.append("age", profile.age);
      if (profile.color) formData.append("color", profile.color);
      if (profile.bloodGroup)
        formData.append("blood_group", profile.bloodGroup);
      if (profile.important_note)
        formData.append("important_note", profile.important_note);
      formData.append("note_is_pinned", profile.isPinned ? "true" : "false");
      if (profile.username) formData.append("username", profile.username);
      if (profile.bio) formData.append("bio", profile.bio);
      // if (textColor) formData.append("about_text_color", textColor);
      // if (fontFamily) formData.append("font_family", fontFamily);
      // if (profile.fontSize) formData.append("font_size", profile.fontSize);
      // if (selectedBg) formData.append("background_color", selectedBg);
      // if (blur) formData.append("background_blur", blur);

      // ✅ customization (FIXED)
      formData.append("about_text_color", customization.textColor);
      formData.append("font_family", customization.fontFamily);
      formData.append("font_size", customization.fontSize);
      formData.append("background_color", customization.backgroundColor);
      formData.append("background_blur", customization.blurLevel);
      if (
        customization.backgroundImage?.startsWith("blob:") ||
        customization.backgroundImage instanceof File
      ) {
        const res = await fetch(customization.backgroundImage);
        const blob = await res.blob();
        const file = new File([blob], "background.png", { type: blob.type });
        formData.append("backgroundImage", file);
      } else if (shouldRemoveBgImage) {
        formData.append("remove_background_image", "true");
      }

      if (layout) formData.append("layout", layout);
      if (profileImg) formData.append("profilePicture", profileImg);
      await dispatch(savePETProfile(formData));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
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

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result;
      dispatch(
        setCropModal({
          open: true,
          src: url,
          type: type === "profile" ? profileShape || "circle" : "rect",
          for: type,
        }),
      );
      // Do NOT dispatch setCropResult here — profileShape would become undefined.
      // The result is committed only after the user crops (onCropComplete).
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
        type: type === "profile" ? profileShape || "circle" : "rect",
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
          onCropComplete={(base64, shape, blob) => {
            // 1️⃣ Update Redux for live preview (pass shape so profileShape stays correct)
            dispatch(setCropResult({ type: cropFor, url: base64, shape }));

            // 2️⃣ Keep the Blob for API upload
            dispatch(
              setProfileField({
                name: cropFor === "profile" ? "profileImg" : "backgroundImage",
                value: blob,
              }),
            );

            dispatch(setCropModal({ open: false }));
          }}
        />

        {loading && <Loader />}

        <div className="flex flex-col w-full p-4 md:p-6 bg-[#ffffff] dark:bg-[#262626] rounded-lg gap-8 transition-colors">
          <Tabs defaultValue="about" className="w-full">
            <div className="bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-full py-1 w-full h-11">
              <TabsList className="flex justify-between rounded-full w-full">
                {[
                  "About",
                  "Contact",
                  "Identification",
                  "Medical Information",
                ].map((tab) => (
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
              <div className="flex flex-col w-full gap-6">
                <TabsContent value="about">
                  <div className="flex flex-col gap-4 bg-[#F5F5F5] dark:bg-[#303030] rounded-2xl p-4 md:p-6 transition-colors mb-2">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative w-[120px] h-[120px] group">
                        {profileImg ? (
                          <img
                            src={profileImg}
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
                        <a
                          type="button"
                          onClick={() => handleEditClick(profileImg, "profile")}
                          className="absolute bottom-2 right-2 bg-black p-2 rounded-full shadow-md"
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

                      <div className="flex flex-col gap-6 w-full">
                        <div className="grid grid-col gap-4">
                          <div>
                            <label className="text-sm block mb-1 text-white capitalize">
                              Name
                            </label>
                            <Input
                              name="pet_name"
                              value={profile?.pet_name || ""}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-white/35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm block mb-1 text-white capitalize">
                              Gender
                            </label>
                            <Input
                              name="gender"
                              value={profile?.gender}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-white/35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-sm block mb-1 text-white capitalize">
                              Breed
                            </label>
                            <Input
                              name="breed"
                              value={profile.breed}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-white/35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Height */}
                          <div>
                            <label className="text-sm block mb-1 text-white capitalize">
                              Age
                            </label>
                            <Input
                              type={"number"}
                              name="age"
                              value={profile.age}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-white/35 rounded-2xl h-[55px] text-black dark:text-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>

                          {/* Weight */}
                          <div>
                            <label className="text-sm block mb-1 text-white capitalize">
                              Color
                            </label>
                            <Input
                              name="color"
                              value={profile.color}
                              onChange={handleChange}
                              className="bg-[#FAFAFA] dark:bg-[#4F4C4C3B] w-full border border-white/35 rounded-2xl h-[55px] text-black dark:text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm block mb-1 text-white">
                            Important
                          </label>
                          <div className="relative">
                            <Textarea
                              name="important_note"
                              value={profile.important_note}
                              onChange={handleChange}
                              className="bg-[#4F4C4C3B] border border-white/35 rounded-xl w-full min-h-20 p-3 text-white resize-none"
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
                  </div>
                  <CustomAccordion
                    onBgChange={(v) => dispatch(setBg(v))}
                    onBlurChange={(v) => dispatch(setBlur(v))}
                    onTextColorChange={(v) => dispatch(setTextColor(v))}
                    onFontChange={(v) => dispatch(setFontFamily(v))}
                    onFontSizeChange={(v) => dispatch(setFontSize(v))}
                    backgroundInputRef={backgroundInputRef}
                    onBackgorundImgChange={(v) => dispatch(setBgImage(v))}
                    blurValue={customization.blurLevel}
                    currentBgColor={customization.backgroundColor}
                    currentBgImage={customization.backgroundImage}
                  />
                  <Footer onSave={handleSave} loading={isSaving} />
                </TabsContent>
                <TabsContent value="contact">
                  <Suspense fallback={<Loader />}>
                    <ContactSection />
                  </Suspense>
                </TabsContent>
                <TabsContent value="identification">
                  <Suspense fallback={<Loader />}>
                    <Identification />
                  </Suspense>
                </TabsContent>
                <TabsContent value="medical information">
                  <Suspense fallback={<Loader />}>
                    <MedicalInformation />
                  </Suspense>
                </TabsContent>

                {/* <button className="inside mt-4 p-2 ml-auto w-[120px] bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors">
                  Update
                </button> */}
              </div>
              <div className=" sticky top-0 self-start h-fit">
                <PetLivePreview />
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

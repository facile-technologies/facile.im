"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectSOSProfile,
  selectSOSPreviewCustom,
  selectSOSProfileImg,
} from "@/app/stores/selectors/sosProfileSelector";
import { LocationEdit, PhoneCallIcon } from "lucide-react";

export default function ProfileView() {
  const profile = useSelector(selectSOSProfile);
  const profileImg = useSelector(selectSOSProfileImg);
  const { selectedBg, blur, textColor, fontFamily } = useSelector(
    selectSOSPreviewCustom
  );
  const appliedTextColor = textColor || "#fff";
  const appliedFontFamily = fontFamily;
  const isPinned = profile.isPinned;
  const layoutType = useSelector((state) => state.sosprofile.layout);
  const contactInfo = useSelector((state) => state.sosprofile.contactInfo);
  const mediaclInfo = useSelector((state) => state.sosprofile.medicalInfo);
  const profileShape = useSelector((state) => state.sosprofile.profileShape);
  const insurancesCompanyName = useSelector(
    (state) => state.sosprofile.insurnacCompanyName
  );
  const insurancesID = useSelector((state) => state.sosprofile.insuranceID);
  const cardBg = useSelector(
    (state) => state.sosprofile.ContactCustomization.backgroundColor
  );
  const headerTextColor = useSelector(
    (state) => state.sosprofile.ContactCustomization.headerTextColor
  );
  const doctorContactInfo = useSelector(
    (state) => state.sosprofile.doctorContactInfo
  );
  const emmergencyAddressDetail = useSelector(
    (state) => state.sosprofile.emmergencyAddress
  );
  const bodyTextColor = useSelector(
    (state) => state.sosprofile.ContactCustomization.bodyTextColor
  );
  const title = useSelector(
    (state) => state.sosprofile.ContactCustomization.title
  );

  //Mediacl Info
  const medicalcardBg = useSelector(
    (state) => state.sosprofile.medicaCustomization.backgroundColor
  );
  const mediaclheaderTextColor = useSelector(
    (state) => state.sosprofile.medicaCustomization.headerTextColor
  );
  const mediaclbodyTextColor = useSelector(
    (state) => state.sosprofile.medicaCustomization.bodyTextColor
  );
  const mediacltitle = useSelector(
    (state) => state.sosprofile.medicaCustomization.title
  );

  const [activeTab, setActiveTab] = useState("Contacts");

  const renderMetricCard = (label, value, align = "center") => (
    <div
      className={`bg-[#3F3F3F] p-4 rounded-[10px] flex flex-col ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-left"
      } justify-center`}
    >
      <p className="text-sm text-white opacity-70">{label}</p>
      <p className="text-[16px] text-white font-medium">{value}</p>
    </div>
  );

  const renderCardLayout = () => (
    <div className="grid grid-cols-2 gap-4 justify-center">
      {renderMetricCard("Height", profile.height || "", "center")}
      {renderMetricCard("Weight", profile.weight || "", "center")}
      {renderMetricCard("Blood Group", profile.bloodGroup || "", "center")}
      {isPinned &&
        renderMetricCard("Important", profile.important || "", "center")}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-4">
      {renderMetricCard("Height", profile.height || "", "left")}
      {renderMetricCard("Weight", profile.weight || "", "left")}
      {renderMetricCard("Blood Group", profile.bloodGroup || "", "left")}
      {isPinned &&
        renderMetricCard("Important", profile.important || "", "left")}
    </div>
  );

  return (
    <div
      className="relative w-full lg:w-[370px] min-h-[500px] rounded-3xl overflow-hidden shadow-lg"
      style={{
        color: appliedTextColor,
        backgroundColor: selectedBg || "#000",
        fontFamily: appliedFontFamily,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            selectedBg &&
            (selectedBg.includes("blob:") || selectedBg.includes("http"))
              ? `url(${selectedBg})`
              : "none",
          backgroundColor:
            selectedBg &&
            !selectedBg.includes("blob:") &&
            !selectedBg.includes("http")
              ? selectedBg
              : "transparent",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: `blur(${(blur ?? 50) / 10}px)`,
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center p-4 md:p-4">
        <div className="relative z-10 mb-2">
          {profileImg ? (
            <img
              src={profileImg}
              alt="profile"
              loading="lazy" // Lazy load the image
              className={`block mx-auto  dark:bg-[#7B7B7B]
                ${
                  profileShape === "circle"
                    ? "rounded-full w-[100px] h-[100px]"
                    : ""
                }
                ${
                  profileShape === "square"
                    ? "rounded-md w-[90px] h-[90px]"
                    : ""
                }
                ${
                  profileShape === "rectangle"
                    ? "rounded-md w-[140px] h-[90px]"
                    : ""
                }`}
            />
          ) : (
            <div className="w-[100px] h-[100px] bg-[#7B7B7B] border-2 border-[#4F2E86] flex items-center justify-center text-xs mx-auto rounded-full">
              No Image
            </div>
          )}
        </div>
        <h4
          className="text-lg font-semibold"
          style={{ color: appliedTextColor }}
        >
          {profile.firstName} {profile.lastName}
        </h4>

        {/* Gender + DOB */}
        <p
          className="text-sm text-gray-700 dark:text-gray-300 mb-2"
          style={{ color: appliedTextColor }}
        >
          {profile.gender} {profile.gender.length > 0 ? "•" : ""}{" "}
          {profile.birthday}
        </p>

        {isPinned === false && (
          <div className="relative w-full flex justify-center mt-3">
            <div className="absolute -top-3 bg-white text-black text-xs font-medium px-4 py-1 rounded-full shadow-sm border border-[#ED1B2E]">
              Important
            </div>
            <div className="border border-[#ED1B2E] rounded-2xl px-4 py-3 text-white text-sm w-full text-center">
              {profile.important}
            </div>
          </div>
        )}

        {/* Metrics Section */}
        <div className="w-full mt-2 mb-6">
          {layoutType === "card" ? renderCardLayout() : renderListLayout()}
        </div>
        {(contactInfo && contactInfo.length > 0) ||
        (doctorContactInfo && doctorContactInfo.length > 0) ||
        (emmergencyAddressDetail && emmergencyAddressDetail.length > 0) ? (
          <div className="w-full flex flex-col items-start">
            <h5
              className="text-lg font-semibold"
              style={{ color: headerTextColor }}
            >
              {title || "Guardian Information"}
            </h5>
            <div className="flex items-start mb-4 gap-3">
              <a
                type="button"
                className={`font-medium rounded-lg ${
                  activeTab === "Contacts" ? "text-white" : "text-white/50"
                }`}
                onClick={() => setActiveTab("Contacts")}
              >
                Contacts
              </a>
              <a
                type="button"
                className={`font-medium rounded-lg ${
                  activeTab === "Doctor" ? "text-white" : "text-white/50"
                }`}
                onClick={() => setActiveTab("Doctor")}
              >
                Doctor
              </a>
              <a
                type="button"
                className={`font-medium rounded-lg ${
                  activeTab === "Address" ? "text-white" : "text-white/50"
                }`}
                onClick={() => setActiveTab("Address")}
              >
                Address
              </a>
            </div>
            {/* Display the selected tab's content */}
            {activeTab === "Contacts" && (
              <div className="space-y-2 w-full mb-2 rounded-2xl">
                {contactInfo && contactInfo.length > 0 ? (
                  contactInfo.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div className="flex flex-col items-start">
                        <p
                          className="text-white font-medium"
                          style={{ color: bodyTextColor }}
                        >
                          {contact.emmergencyContactName}
                        </p>
                        <p
                          className="text-sm text-white opacity-70"
                          style={{ color: bodyTextColor }}
                        >
                          {contact.phoneNumber}
                        </p>
                        <p
                          className="text-sm text-white opacity-70"
                          style={{ color: bodyTextColor }}
                        >
                          {contact.whatsAppNumber}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a type="button" className="text-white">
                          <PhoneCallIcon /> {/* Phone icon */}
                        </a>
                        <a type="button" className="text-white">
                          <PhoneCallIcon /> {/* WhatsApp icon */}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white opacity-70 flex items-center justify-between p-4 rounded-2xl">
                    No contacts available.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full mb-4">
            <div className="border-2 border-dashed border-[#fff] rounded-2xl p-12 text-center">
              <button className="livePreviewBtn text-white bg-transparent hover:bg-gray-800 rounded-lg px-4 py-2 transition">
                + Add Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

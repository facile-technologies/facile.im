import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  selectPetPreviewCustom,
  selectPetProfileImg,
  selectPetProfile,
} from "@/app/stores/selectors/petProfileSelector";
import { LocationEdit, PhoneCallIcon, Wifi, Signal, BatteryFull, ExternalLink } from "lucide-react";
import WhatsAppIcon from "@/assets/svgs/whatsappicon.svg";

export default function PetLivePreview() {
  const profile = useSelector(selectPetProfile);
  const profileImg = useSelector(selectPetProfileImg);
  const { backgroundColor, backgroundImage, blur, textColor, fontFamily, fontSize } = useSelector(selectPetPreviewCustom);
  const aboutLayout = useSelector((state) => state.petprofile.customization?.layout);

  const appliedTextColor = textColor || "#fff";
  const appliedFontFamily = fontFamily;
  const appliedFontSize = fontSize;
  const isPinned = profile.isPinned;
  const contactInfo = useSelector((state) => state.petprofile.contactInfo);
  const mediaclInfo = useSelector((state) => state.petprofile.medicalInfo);
  const profileShape = useSelector((state) => state.petprofile.profileShape);
  const visibilityByType = useSelector((state) => state.petprofile.visibilityByType);
  const cardBg = useSelector((state) => state.petprofile.ContactCustomization.backgroundColor);
  const headerTextColor = useSelector((state) => state.petprofile.ContactCustomization.headerTextColor);
  const doctorContactInfo = useSelector((state) => state.petprofile.doctorContactInfo);
  const emmergencyAddressDetail = useSelector((state) => state.petprofile.emmergencyAddress);
  const bodyTextColor = useSelector((state) => state.petprofile.ContactCustomization.bodyTextColor);
  const title = useSelector((state) => state.petprofile.ContactCustomization.title);
  const contactBtnEnabled = useSelector((state) => state.petprofile.ContactCustomization.contactBtnEnabled);
  const { identification, identificationLayout, identificationCustomization } = useSelector((state) => state.petprofile);
  const medicalcardBg = useSelector((state) => state.petprofile.medicaCustomization.backgroundColor);
  const mediaclheaderTextColor = useSelector((state) => state.petprofile.medicaCustomization.headerTextColor);
  const mediaclbodyTextColor = useSelector((state) => state.petprofile.medicaCustomization.bodyTextColor);
  const mediacltitle = useSelector((state) => state.petprofile.medicaCustomization.title);
  const insurancesCompanyName = useSelector((state) => state.petprofile.insurnacCompanyName);
  const insurancesID = useSelector((state) => state.petprofile.insuranceID);
  const username = useSelector((state) => state.user.user?.username);

  const visibleEmergencyContacts = (contactInfo || []).filter((c) => {
    const override = visibilityByType?.emergency?.[c.id];
    const visible = override ?? c.is_visible ?? true;
    return visible === true;
  });
  const visibleDoctorContacts = (doctorContactInfo || []).filter((c) => {
    const override = visibilityByType?.doctor?.[c.id];
    const visible = override ?? c.is_visible ?? true;
    return visible === true;
  });
  const visibleAddresses = (emmergencyAddressDetail || []).filter((c) => {
    const override = visibilityByType?.address?.[c.id];
    const visible = override ?? c.is_visible ?? true;
    return visible === true;
  });

  const [activeTab, setActiveTab] = useState("Contacts");
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleMouseDown = (e) => { setIsDragging(true); setStartY(e.pageY); };
  const handleMouseLeave = () => { setIsDragging(false); };
  const handleMouseUp = () => { setIsDragging(false); };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const y = e.pageY;
    const walk = (y - startY) * 2;
    scrollContainerRef.current.scrollTop -= walk;
    setStartY(y);
  };

  const renderMetricCard = (label, value, align = "center") => (
    <div
      className={`bg-[#3F3F3F] p-4 rounded-[10px] flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } justify-center`}
    >
      <p className="text-sm text-white opacity-70">{label}</p>
      <p className="text-[16px] text-white font-medium">{value}</p>
    </div>
  );

  const renderCardLayout = () => (
    <div className="grid grid-cols-2 gap-4 justify-center">
      {renderMetricCard("Breed", profile.breed)}
      {renderMetricCard("Color", profile.color)}
      {isPinned && renderMetricCard("Important", profile.important_note)}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-4">
      {renderMetricCard("Breed", profile.breed, "start")}
      {renderMetricCard("Color", profile.color, "start")}
      {isPinned && renderMetricCard("Important", profile.important_note, "start")}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-auto mx-auto p-4 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-2 w-full lg:w-[375px]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Preview</h2>
        <a
          href={username ? `/pet/${username}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          View card <ExternalLink size={16} />
        </a>
      </div>

      <div className="relative">
        {/* Physical side buttons */}
        <div className="absolute -left-[3px] top-24 w-[3px] h-12 bg-gray-300 dark:bg-gray-700 rounded-l-md shadow-sm"></div>
        <div className="absolute -left-[3px] top-40 w-[3px] h-12 bg-gray-300 dark:bg-gray-700 rounded-l-md shadow-sm"></div>
        <div className="absolute -right-[3px] top-32 w-[3px] h-20 bg-gray-300 dark:bg-gray-700 rounded-r-md shadow-sm"></div>

        {/* Outer device frame */}
        <div className="relative w-full lg:w-[375px] h-[720px] bg-black border-10 border-gray-100 dark:border-[#2B2B2B] rounded-[55px] shadow-2xl overflow-hidden ring-4 ring-gray-200 dark:ring-black/20">

          {/* Scrollable content area */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`w-full h-full overflow-y-auto no-scrollbar ${isDragging ? "cursor-grabbing select-none scroll-auto" : "cursor-default scroll-smooth"}`}
            style={{
              color: appliedTextColor,
              backgroundColor: backgroundColor || "#000",
              fontFamily: appliedFontFamily,
              fontSize: `${appliedFontSize}px`,
            }}
          >
            {/* Background blur overlay */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: backgroundImage ? "transparent" : (backgroundColor || "transparent"),
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: `blur(${(blur ?? 50) / 10}px)`,
                transform: "scale(1.1)",
              }}
            />

            {/* Status bar */}
            <div className="relative flex items-center justify-between px-8 py-4 bg-transparent pointer-events-none z-50">
              <span className="text-[14px] font-bold" style={{ color: appliedTextColor }}>9:41</span>
              <div className="absolute left-1/2 -translate-x-1/2 top-4 w-28 h-7 bg-black rounded-full shadow-lg border border-white/10 flex items-center justify-center">
                <div className="w-10 h-1 bg-gray-800/80 rounded-full"></div>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: appliedTextColor }}>
                <Signal size={16} />
                <Wifi size={16} />
                <BatteryFull size={16} />
              </div>
            </div>

            {/* Profile content */}
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <div className="relative z-10 mb-2">
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="profile"
                    className={`block mx-auto dark:bg-[#7B7B7B] ${
                      profileShape === "circle" ? "rounded-full w-[100px] h-[100px]" : ""
                    } ${
                      profileShape === "square" ? "rounded-md w-[90px] h-[90px]" : ""
                    } ${
                      profileShape === "rectangle" ? "rounded-md w-[140px] h-[90px]" : ""
                    }`}
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-[#7B7B7B] border-2 border-[#4F2E86] flex items-center justify-center text-xs mx-auto rounded-full">
                    No Image
                  </div>
                )}
              </div>

              <h4 className="text-lg font-semibold" style={{ color: appliedTextColor }}>
                {profile.pet_name}
              </h4>

              <p className="text-sm mb-2" style={{ color: appliedTextColor }}>
                {profile.gender} {profile?.gender?.length > 0 ? "•" : ""} {profile.age}
              </p>

              {isPinned === false && (
                <div className="relative w-full flex justify-center mt-5">
                  <div className="border border-[#ED1B2E] rounded-2xl px-4 pt-5 pb-3 text-white text-sm w-full text-center">
                    {profile.important_note}
                  </div>
                  <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-white text-black text-xs font-medium px-4 py-1 rounded-full shadow-sm border border-[#ED1B2E] whitespace-nowrap">
                    Important
                  </div>
                </div>
              )}

              <div className="w-full mt-2 mb-6">
                {aboutLayout === "CARD" ? renderCardLayout() : renderListLayout()}
              </div>

              {visibleEmergencyContacts.length > 0 || visibleDoctorContacts.length > 0 || visibleAddresses.length > 0 ? (
                <div className="w-full flex flex-col items-start">
                  <h5 className="text-lg font-semibold" style={{ color: headerTextColor }}>
                    {title || "Guardian Information"}
                  </h5>
                  <div className="flex items-start mb-4 gap-3">
                    <a type="button" className={`font-medium rounded-lg ${activeTab === "Contacts" ? "text-white" : "text-white/50"}`} onClick={() => setActiveTab("Contacts")}>Contacts</a>
                    <a type="button" className={`font-medium rounded-lg ${activeTab === "Doctor" ? "text-white" : "text-white/50"}`} onClick={() => setActiveTab("Doctor")}>Doctor</a>
                    <a type="button" className={`font-medium rounded-lg ${activeTab === "Address" ? "text-white" : "text-white/50"}`} onClick={() => setActiveTab("Address")}>Address</a>
                  </div>
                  {activeTab === "Contacts" && (
                    <div className="space-y-2 w-full mb-2 rounded-2xl">
                      {visibleEmergencyContacts.length > 0 ? (
                        visibleEmergencyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: cardBg }}>
                            <div className="flex flex-col items-start">
                              <p className="text-white font-medium" style={{ color: bodyTextColor }}>{contact.contact_name}</p>
                              <p className="text-sm text-white opacity-70" style={{ color: bodyTextColor }}>{contact.phone_number}</p>
                              <p className="text-sm text-white opacity-70" style={{ color: bodyTextColor }}>{contact.whatsapp_number}</p>
                            </div>
                            {contactBtnEnabled && (
                              <div className="flex gap-2">
                                <a type="button" className="text-white"><PhoneCallIcon size={24} /></a>
                                <a type="button" className="text-white"><img src={WhatsAppIcon} alt="WhatsApp" className="w-6 h-6" /></a>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white opacity-70 p-4">No contacts available.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "Doctor" && (
                    <div className="space-y-2 w-full mb-2 rounded-2xl">
                      {visibleDoctorContacts.length > 0 ? (
                        visibleDoctorContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: cardBg }}>
                            <div className="flex flex-col items-start">
                              <p className="text-white font-medium" style={{ color: bodyTextColor }}>{contact.doctor_name}</p>
                              <p className="text-sm text-white opacity-70" style={{ color: bodyTextColor }}>{contact.phone_number}</p>
                              <p className="text-sm text-white opacity-70" style={{ color: bodyTextColor }}>{contact.whatsapp_number}</p>
                            </div>
                            {contactBtnEnabled && (
                              <div className="flex gap-2">
                                <a type="button" className="text-white"><PhoneCallIcon size={24} /></a>
                                <a type="button" className="text-white"><img src={WhatsAppIcon} alt="WhatsApp" className="w-6 h-6" /></a>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white opacity-70 p-4">No contacts available.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "Address" && (
                    <div className="space-y-2 w-full mb-2 rounded-2xl">
                      {visibleAddresses.length > 0 ? (
                        visibleAddresses.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: cardBg }}>
                            <div className="flex flex-col items-start">
                              <p className="text-white font-medium" style={{ color: bodyTextColor }}>{contact.address_description}</p>
                              <p className="text-sm text-white opacity-70" style={{ color: bodyTextColor }}>{contact.house_number}</p>
                            </div>
                            <div className="flex gap-2">
                              <a type="button" className="text-white"><LocationEdit /></a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white opacity-70 p-4">No addresses available.</p>
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

              {/* Identification */}
              <div className="w-full flex flex-col items-start">
                <div className="space-y-2 w-full mb-2 rounded-2xl">
                  <h5 className="text-lg font-semibold text-white mb-2 text-left">
                    {identificationCustomization.title || "Identification"}
                  </h5>
                  {identificationLayout === "CARD" ? (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Chipped", value: identification.chipped },
                        { label: "Collar", value: identification.collar },
                        { label: "Special Feature", value: identification.specialFeature },
                      ].map((item, index) => (
                        <div key={index} className={`w-full rounded-lg px-3 py-2 text-xs text-white/80 ${item.label === "Special Feature" && "col-span-2"}`} style={{ backgroundColor: identificationCustomization.backgroundColor }}>
                          <div className="text-[14px]" style={{ color: identificationCustomization.headerTextColor }}>{item.label}</div>
                          <div style={{ color: identificationCustomization.bodyTextColor }}>{item.value || ""}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 text-left">
                      {[
                        { label: "Chipped", value: identification.chipped },
                        { label: "Collar", value: identification.collar },
                        { label: "Special Feature", value: identification.specialFeature },
                      ].map((item, index) => (
                        <div key={index} className="w-full rounded-lg px-3 py-2 text-xs text-white/80" style={{ backgroundColor: identificationCustomization.backgroundColor }}>
                          <div className="text-[14px]" style={{ color: identificationCustomization.headerTextColor }}>{item.label}</div>
                          <div style={{ color: identificationCustomization.bodyTextColor }}>{item.value || ""}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Information */}
              <div className="w-full flex flex-col items-start">
                <div className="space-y-2 w-full mb-2 rounded-2xl">
                  {mediaclInfo && mediaclInfo.length > 0 ? (
                    <div className="w-full flex flex-col items-start">
                      <h5 className="text-lg font-semibold" style={{ color: mediaclheaderTextColor }}>
                        {mediacltitle || "Medical Information"}
                      </h5>
                      {mediaclInfo?.filter((m) => (m?.is_visible ?? true) === true).map((contact, index) => {
                        if (contact && contact.disease_name && contact.disease_detail) {
                          return (
                            <div key={index} className="flex w-full items-center justify-between p-4 rounded-2xl mt-2" style={{ backgroundColor: medicalcardBg }}>
                              <div className="flex flex-col items-start">
                                <p className="text-white font-medium" style={{ color: mediaclbodyTextColor }}>{contact.disease_name}</p>
                                <p className="text-sm text-white opacity-70" style={{ color: mediaclbodyTextColor }}>{contact.disease_detail}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="w-full mb-4">
                      <div className="border-[2px] border-dashed border-[#fff] rounded-2xl p-10 text-center">
                        <button className="livePreviewBtn w-full text-white bg-transparent hover:bg-gray-800 rounded-lg px-1 py-2 transition">
                          + Add Medical Information
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Information */}
              <div className="w-full flex flex-col items-start">
                <div className="space-y-2 w-full mb-2 rounded-2xl">
                  {insurancesCompanyName || insurancesID ? (
                    <div className="w-full flex flex-col items-start">
                      <h5 className="text-lg font-semibold" style={{ color: mediaclheaderTextColor }}>
                        Insurance Information
                      </h5>
                      <div className="flex w-full items-center justify-between p-4 rounded-2xl mt-2" style={{ backgroundColor: medicalcardBg }}>
                        <div className="flex flex-col items-start">
                          {insurancesCompanyName && (
                            <p className="text-white font-medium" style={{ color: mediaclbodyTextColor }}>
                              {insurancesCompanyName}
                            </p>
                          )}
                          {insurancesID && (
                            <p className="text-sm text-white opacity-70" style={{ color: mediaclbodyTextColor }}>
                              {insurancesID}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full mb-4">
                      <div className="border-[2px] border-dashed border-[#fff] rounded-2xl p-10 text-center">
                        <button className="livePreviewBtn w-full text-white bg-transparent hover:bg-gray-800 rounded-lg px-1 py-2 transition">
                          + Add Insurance Information
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

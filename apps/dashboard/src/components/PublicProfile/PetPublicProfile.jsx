"use client";

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PhoneCallIcon, LocationEdit } from "lucide-react";
import WhatsAppIcon from "@/assets/svgs/whatsappicon.svg";
import Loader from "@/store/utils/Loader";
import { getPetPublicProfile } from "@/services/user";

export default function PetPublicProfile() {
  const { code } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Contacts");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // If navigated from device-code redirect, reuse the already-fetched data
        const preloaded = location.state?.profileData;
        const payload = preloaded || (await getPetPublicProfile(code)).data;

        const insList = payload.medicalInsurances || [];
        const latestInsurance =
          insList.length > 0
            ? insList.reduce((latest, curr) => {
                const latestTime = new Date(
                  latest.updatedAt || latest.createdAt || 0
                ).getTime();
                const currTime = new Date(
                  curr.updatedAt || curr.createdAt || 0
                ).getTime();
                return currTime > latestTime ? curr : latest;
              })
            : null;

        const idn = payload.petIdentification || {};

        setData({
          profile: {
            petName: payload.profile?.pet_name || "",
            gender: payload.profile?.gender || "",
            age: payload.profile?.age || "",
            breed: payload.profile?.breed || "",
            color: payload.profile?.color || "",
            importantNote: payload.profile?.important_note || "",
            isPinned: payload.profile?.note_is_pinned ?? true,
            profileImage: payload.profile?.profile_image || null,
          },
          customization: {
            backgroundColor:
              payload.customization?.background_color || "#000000",
            backgroundImage:
              payload.customization?.background_image || null,
            textColor:
              payload.customization?.about_text_color || "#ffffff",
            fontFamily: payload.customization?.font_family || "Poppins",
            blurLevel: Number(payload.customization?.background_blur ?? 50),
            layout: payload.customization?.layout || "CARD",
          },
          contactCustomization: {
            backgroundColor:
              payload.petContactsCustomization?.background_color || "#3F3F3F",
            headerTextColor:
              payload.petContactsCustomization?.header_color || "#ffffff",
            bodyTextColor:
              payload.petContactsCustomization?.body_color || "#ffffff",
            title:
              payload.petContactsCustomization?.title_color ||
              "Guardian Information",
            contactBtnEnabled:
              payload.petContactsCustomization?.contact_btn_enabled ?? false,
          },
          medicalCustomization: {
            headerText:
              payload.petMedicalCustomization?.header_text ||
              "Medical Information",
            backgroundColor:
              payload.petMedicalCustomization?.background_color || "#3F3F3F",
            headerTextColor:
              payload.petMedicalCustomization?.header_color || "#ffffff",
            bodyTextColor:
              payload.petMedicalCustomization?.body_color || "#ffffff",
          },
          identification: {
            chipped: idn.chipped || "",
            collar: idn.collar || "",
            specialFeature: idn.special_feature || "",
          },
          identificationCustomization: {
            title: idn.header_text || "Identification",
            backgroundColor: idn.background_color || "#3F3F3F",
            headerTextColor: idn.header_color || "#ffffff",
            bodyTextColor: idn.body_color || "#ffffff",
          },
          identificationLayout: idn.layout || "LIST",
          emergencyContacts: payload.emergencyContacts || [],
          doctorContacts: payload.doctorsContacts || [],
          addresses: payload.addresses || [],
          medicalDetails: payload.medicalDetails || [],
          insuranceCompany: latestInsurance?.insurance_company || "",
          insuranceID: latestInsurance?.insurance_id || "",
        });
      } catch (error) {
        console.error("Failed to load pet public profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (code) fetchProfile();
  }, [code]);

  if (isLoading) return <Loader />;

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white! dark:bg-[#111]">
        <p className="text-gray-500 font-bold">Profile not found</p>
      </div>
    );
  }

  const {
    profile,
    customization,
    contactCustomization,
    medicalCustomization,
    identification,
    identificationCustomization,
    identificationLayout,
    emergencyContacts,
    doctorContacts,
    addresses,
    medicalDetails,
    insuranceCompany,
    insuranceID,
  } = data;

  const hasContacts =
    emergencyContacts.length > 0 ||
    doctorContacts.length > 0 ||
    addresses.length > 0;

  const visibleMedical = medicalDetails.filter(
    (m) => (m.is_visible ?? true) && m.disease_name && m.disease_detail
  );

  const renderMetricCard = (label, value) => (
    <div
      className={`bg-[#3F3F3F] p-4 rounded-[10px] flex flex-col ${
        customization.layout === "CARD"
          ? "items-center text-center"
          : "items-start text-left"
      } justify-center`}
    >
      <p className="text-sm text-white opacity-70">{label}</p>
      <p className="text-base text-white font-medium">{value || ""}</p>
    </div>
  );

  const identFields = [
    { label: "Chipped", value: identification.chipped },
    { label: "Collar", value: identification.collar },
    { label: "Special Feature", value: identification.specialFeature },
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white! dark:bg-[#111]">
      <div
        className="relative w-full max-w-[600px] h-full md:h-screen shadow-2xl overflow-hidden border border-white/10"
        style={{ fontFamily: customization.fontFamily }}
      >
        {/* Background layer */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: customization.backgroundImage
              ? `url(${customization.backgroundImage})`
              : "none",
            backgroundColor: customization.backgroundColor || "#111",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Blur overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backdropFilter: `blur(${(customization.blurLevel ?? 50) / 10}px)`,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        />

        {/* Scrollable content */}
        <div
          className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center text-center px-4 py-8"
          style={{ color: customization.textColor }}
        >
          {/* Profile Image */}
          <div className="mb-4">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="pet profile"
                className="rounded-full w-[110px] h-[110px] object-cover border-4 border-white shadow-xl mx-auto"
              />
            ) : (
              <div className="w-[110px] h-[110px] rounded-full bg-[#7B7B7B] border-4 border-white flex items-center justify-center text-xs mx-auto text-white shadow-xl">
                No Image
              </div>
            )}
          </div>

          {/* Name */}
          <h1
            className="text-2xl font-black tracking-tight mb-1"
            style={{ color: customization.textColor }}
          >
            {profile.petName}
          </h1>
          <p
            className="text-sm opacity-70 mb-6"
            style={{ color: customization.textColor }}
          >
            {profile.gender}
            {profile.gender && profile.age ? " • " : ""}
            {profile.age}
          </p>

          {/* Important Note (when isPinned is false) */}
          {profile.isPinned === false && profile.importantNote && (
            <div className="relative w-full flex justify-center mb-6">
              <div className="border border-[#ED1B2E] rounded-2xl px-4 pt-5 pb-3 text-sm w-full text-center">
                {profile.importantNote}
              </div>
              <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-white text-black text-xs font-medium px-4 py-1 rounded-full shadow-sm border border-[#ED1B2E] whitespace-nowrap">
                Important
              </div>
            </div>
          )}

          {/* Pet Metrics */}
          <div
            className={`w-full mb-6 ${
              customization.layout === "CARD"
                ? "grid grid-cols-2 gap-4"
                : "space-y-4"
            }`}
          >
            {profile.breed && renderMetricCard("Breed", profile.breed)}
            {profile.color && renderMetricCard("Color", profile.color)}
            {profile.isPinned && profile.importantNote && renderMetricCard("Important", profile.importantNote)}
          </div>

          {/* Contacts Section */}
          {hasContacts && (
            <div className="w-full mb-6 text-left">
              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: contactCustomization.headerTextColor }}
              >
                {contactCustomization.title || "Guardian Information"}
              </h2>
              <div className="flex gap-4 mb-4">
                {["Contacts", "Doctor", "Address"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="font-medium text-sm bg-transparent! border-none outline-none p-0"
                    style={{
                      color: contactCustomization.headerTextColor,
                      opacity: activeTab === tab ? 1 : 0.5,
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Contacts" && (
                <div className="space-y-3">
                  {emergencyContacts.filter((c) => c.is_visible ?? true).length > 0 ? (
                    emergencyContacts.filter((c) => c.is_visible ?? true).map((contact, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: contactCustomization.backgroundColor }}>
                        <div className="flex flex-col items-start">
                          <p className="font-medium" style={{ color: contactCustomization.bodyTextColor }}>{contact.contact_name}</p>
                          {contact.phone_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.phone_number}</p>}
                          {contact.whatsapp_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.whatsapp_number}</p>}
                        </div>
                        {contactCustomization.contactBtnEnabled && (
                          <div className="flex gap-2">
                            {contact.phone_number && <a href={`tel:${contact.phone_number}`} style={{ color: contactCustomization.bodyTextColor }}><PhoneCallIcon size={24} /></a>}
                            {contact.whatsapp_number && <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" rel="noopener noreferrer"><img src={WhatsAppIcon} alt="WhatsApp" className="w-6 h-6" /></a>}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm opacity-70 p-4" style={{ color: contactCustomization.bodyTextColor }}>No contacts available.</p>
                  )}
                </div>
              )}

              {activeTab === "Doctor" && (
                <div className="space-y-3">
                  {doctorContacts.filter((c) => c.is_visible ?? true).length > 0 ? (
                    doctorContacts.filter((c) => c.is_visible ?? true).map((contact, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: contactCustomization.backgroundColor }}>
                        <div className="flex flex-col items-start">
                          <p className="font-medium" style={{ color: contactCustomization.bodyTextColor }}>{contact.doctor_name}</p>
                          {contact.phone_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.phone_number}</p>}
                          {contact.whatsapp_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.whatsapp_number}</p>}
                        </div>
                        {contactCustomization.contactBtnEnabled && (
                          <div className="flex gap-2">
                            {contact.phone_number && <a href={`tel:${contact.phone_number}`} style={{ color: contactCustomization.bodyTextColor }}><PhoneCallIcon size={24} /></a>}
                            {contact.whatsapp_number && <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" rel="noopener noreferrer"><img src={WhatsAppIcon} alt="WhatsApp" className="w-6 h-6" /></a>}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm opacity-70 p-4" style={{ color: contactCustomization.bodyTextColor }}>No contacts available.</p>
                  )}
                </div>
              )}

              {activeTab === "Address" && (
                <div className="space-y-3">
                  {addresses.filter((a) => a.is_visible ?? true).length > 0 ? (
                    addresses.filter((a) => a.is_visible ?? true).map((addr, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: contactCustomization.backgroundColor }}>
                        <div className="flex flex-col items-start">
                          <p className="font-medium" style={{ color: contactCustomization.bodyTextColor }}>{addr.address_description}</p>
                          {addr.house_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{addr.house_number}</p>}
                        </div>
                        {addr.address_description && (
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(addr.address_description)}`} target="_blank" rel="noopener noreferrer" style={{ color: contactCustomization.bodyTextColor }}>
                            <LocationEdit size={20} />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm opacity-70 p-4" style={{ color: contactCustomization.bodyTextColor }}>No addresses available.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Identification Section */}
          <div className="w-full mb-6 text-left">
            <h2 className="text-lg font-semibold mb-3" style={{ color: identificationCustomization.headerTextColor }}>
              {identificationCustomization.title || "Identification"}
            </h2>
            {identificationLayout === "CARD" ? (
              <div className="grid grid-cols-2 gap-4">
                {identFields.map((item, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-lg px-3 py-2 ${item.label === "Special Feature" ? "col-span-2" : ""}`}
                    style={{ backgroundColor: identificationCustomization.backgroundColor }}
                  >
                    <div className="text-sm font-medium" style={{ color: identificationCustomization.headerTextColor }}>{item.label}</div>
                    <div className="text-sm opacity-80" style={{ color: identificationCustomization.bodyTextColor }}>{item.value || ""}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {identFields.map((item, i) => (
                  <div key={i} className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: identificationCustomization.backgroundColor }}>
                    <div className="text-sm font-medium" style={{ color: identificationCustomization.headerTextColor }}>{item.label}</div>
                    <div className="text-sm opacity-80" style={{ color: identificationCustomization.bodyTextColor }}>{item.value || ""}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Information */}
          {visibleMedical.length > 0 && (
            <div className="w-full mb-6 text-left">
              <h2 className="text-lg font-semibold mb-3" style={{ color: medicalCustomization.headerTextColor }}>
                {medicalCustomization.headerText || "Medical Information"}
              </h2>
              <div className="space-y-3">
                {visibleMedical.map((item, i) => (
                  <div key={i} className="flex w-full p-4 rounded-2xl" style={{ backgroundColor: medicalCustomization.backgroundColor }}>
                    <div className="flex flex-col items-start">
                      <p className="font-medium" style={{ color: medicalCustomization.bodyTextColor }}>{item.disease_name}</p>
                      <p className="text-sm opacity-70" style={{ color: medicalCustomization.bodyTextColor }}>{item.disease_detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Information */}
          {(insuranceCompany || insuranceID) && (
            <div className="w-full mb-6 text-left">
              <h2 className="text-lg font-semibold mb-3" style={{ color: medicalCustomization.headerTextColor }}>
                Insurance Information
              </h2>
              <div className="flex w-full p-4 rounded-2xl" style={{ backgroundColor: medicalCustomization.backgroundColor }}>
                <div className="flex flex-col items-start">
                  {insuranceCompany && <p className="font-medium" style={{ color: medicalCustomization.bodyTextColor }}>{insuranceCompany}</p>}
                  {insuranceID && <p className="text-sm opacity-70" style={{ color: medicalCustomization.bodyTextColor }}>{insuranceID}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-8 pb-12 flex flex-col items-center opacity-30 shrink-0">
            <img src="/facile.svg" className="w-16 grayscale" alt="Facile" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 text-white">
              Powering Connectivity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

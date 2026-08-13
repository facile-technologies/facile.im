"use client";

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PhoneCallIcon, LocationEdit } from "lucide-react";
import WhatsAppIcon from "@/assets/svgs/whatsappicon.svg";
import Loader from "@/store/utils/Loader";
import { getSosPublicProfile } from "@/services/user";

export default function SosPublicProfile() {
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
        const payload = preloaded || (await getSosPublicProfile(code)).data;

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

        setData({
          profile: {
            firstName: payload.profile?.first_name || "",
            lastName: payload.profile?.last_name || "",
            gender: payload.profile?.gender || "",
            birthday: payload.profile?.dob || "",
            height: payload.profile?.height || "",
            weight: payload.profile?.weight || "",
            bloodGroup: payload.profile?.blood_group || "",
            important: payload.profile?.important_note || "",
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
            layout: payload.customization?.layout || "LIST",
          },
          contactCustomization: {
            backgroundColor:
              payload.sosContactsCustomization?.background_color || "#3F3F3F",
            headerTextColor:
              payload.sosContactsCustomization?.header_color || "#ffffff",
            bodyTextColor:
              payload.sosContactsCustomization?.body_color || "#ffffff",
            title:
              payload.sosContactsCustomization?.title_color || "SOS Contacts",
            contactBtnEnabled:
              payload.sosContactsCustomization?.contact_btn_enabled ?? true,
          },
          medicalCustomization: {
            headerText:
              payload.sosMedicalCustomization?.header_text ||
              "Medical Information",
            backgroundColor:
              payload.sosMedicalCustomization?.background_color || "#3F3F3F",
            headerTextColor:
              payload.sosMedicalCustomization?.header_color || "#ffffff",
            bodyTextColor:
              payload.sosMedicalCustomization?.body_color || "#ffffff",
          },
          emergencyContacts: payload.emergencyContacts || [],
          doctorContacts: payload.doctorsContacts || [],
          addresses: payload.addresses || [],
          medicalDetails: payload.medicalDetails || [],
          insuranceCompany: latestInsurance?.insurance_company || "",
          insuranceID: latestInsurance?.insurance_id || "",
        });
      } catch (error) {
        console.error("Failed to load SOS public profile", error);
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
      <p className="text-base text-white font-medium">{value}</p>
    </div>
  );

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
            backgroundImage:
              customization.backgroundImage
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
                alt="profile"
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
            {profile.firstName} {profile.lastName}
          </h1>
          <p
            className="text-sm opacity-70 mb-6"
            style={{ color: customization.textColor }}
          >
            {profile.gender}
            {profile.gender && profile.birthday ? " • " : ""}
            {profile.birthday}
          </p>

          {/* Important Note (when isPinned is false) */}
          {profile.isPinned === false && profile.important && (
            <div className="relative w-full flex justify-center mb-6">
              <div className="border border-[#ED1B2E] rounded-2xl px-4 pt-5 pb-3 text-sm w-full text-center">
                {profile.important}
              </div>
              <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-white text-black text-xs font-medium px-4 py-1 rounded-full shadow-sm border border-[#ED1B2E] whitespace-nowrap">
                Important
              </div>
            </div>
          )}

          {/* Health Metrics */}
          <div
            className={`w-full mb-6 ${
              customization.layout === "CARD"
                ? "grid grid-cols-2 gap-4"
                : "space-y-4"
            }`}
          >
            {profile.height && renderMetricCard("Height", profile.height)}
            {profile.weight && renderMetricCard("Weight", profile.weight)}
            {profile.bloodGroup && renderMetricCard("Blood Group", profile.bloodGroup)}
            {profile.isPinned && profile.important && renderMetricCard("Important", profile.important)}
          </div>

          {/* Contacts Section */}
          {hasContacts && (
            <div className="w-full mb-6 text-left">
              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: contactCustomization.headerTextColor }}
              >
                {contactCustomization.title || "SOS Contacts"}
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
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-2xl"
                        style={{ backgroundColor: contactCustomization.backgroundColor }}
                      >
                        <div className="flex flex-col items-start">
                          <p className="font-medium" style={{ color: contactCustomization.bodyTextColor }}>{contact.contact_name}</p>
                          {contact.phone_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.phone_number}</p>}
                          {contact.whatsapp_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.whatsapp_number}</p>}
                        </div>
                        {contactCustomization.contactBtnEnabled && (
                          <div className="flex gap-2">
                            {contact.phone_number && <a href={`tel:${contact.phone_number}`} style={{ color: contactCustomization.bodyTextColor }}><PhoneCallIcon size={24} color="white" /></a>}
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
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-2xl"
                        style={{ backgroundColor: contactCustomization.backgroundColor }}
                      >
                        <div className="flex flex-col items-start">
                          <p className="font-medium" style={{ color: contactCustomization.bodyTextColor }}>{contact.doctor_name}</p>
                          {contact.phone_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.phone_number}</p>}
                          {contact.whatsapp_number && <p className="text-sm opacity-70" style={{ color: contactCustomization.bodyTextColor }}>{contact.whatsapp_number}</p>}
                        </div>
                        {contactCustomization.contactBtnEnabled && (
                          <div className="flex gap-2">
                            {contact.phone_number && <a href={`tel:${contact.phone_number}`} style={{ color: contactCustomization.bodyTextColor }}><PhoneCallIcon size={24} color="white" /></a>}
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
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-2xl"
                        style={{ backgroundColor: contactCustomization.backgroundColor }}
                      >
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

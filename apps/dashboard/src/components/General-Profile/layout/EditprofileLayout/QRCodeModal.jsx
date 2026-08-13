import React, { useState } from "react";
import { X, Download, Edit2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import appleWallet from "@/assets/apple-wallet.png";
import EditQRCodeModal from "./EditQRCodeModal";
import { useEffect } from "react";
import { getQRDesign, downloadQRCode } from "@/services/qr";

export default function QRCodeModal({ isOpen, onClose, username, profileImage, userProfileId }) {
  const [showEdit, setShowEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrDesign, setQrDesign] = useState({
    logo: { url: profileImage, size: "Standard", shape: "Round" },
    text: { content: "Scan Me", position: "Top" },
    colors: { foreground: "#000000", background: "#FFFFFF", is_gradient: false }
  });

  useEffect(() => {
    if (isOpen && userProfileId) {
      setIsLoading(true);

      const fetchDesign = async () => {
        try {
          const res = await getQRDesign(userProfileId);
          if (res.data?.data?.qr_design) {
            setQrDesign(res.data.data.qr_design);
          } else if (profileImage) {
            setQrDesign(prev => ({ ...prev, logo: { ...prev.logo, url: profileImage } }));
          }
        } catch (err) {
          console.error("Failed to fetch QR design", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDesign();
    }
  }, [isOpen, userProfileId, profileImage]);

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.facile.im";
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanUrl = url.replace(/^\//, "");

    // If the URL already contains 'uploads', don't add it again
    if (cleanUrl.startsWith("uploads")) {
      return `${cleanBase}/${cleanUrl}`;
    }
    return `${cleanBase}/uploads/${cleanUrl}`;
  };

  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const profileUrl = `facile.in/${username}`;

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await downloadQRCode(userProfileId);
      // Create a blob URL from the response data
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `facile-qr-${username}.png`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download QR code", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#FAFAFA] dark:bg-[#212121] w-full max-w-[550px] rounded-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 relative pb-6">

        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-black dark:text-white text-xl font-semibold">Facile.share</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:text-white! dark:hover:text-gray-300 transition bg-transparent!">
            <X size={24} />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center mt-6">
          {isLoading ? (
            /* Shimmer skeleton while fetching */
            <div className="p-6 rounded-[32px] shadow-lg flex flex-col items-center justify-center relative w-64 h-64 border border-black/5 dark:border-white/10 bg-white dark:bg-[#2A2A2A] overflow-hidden">
              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
              {/* Top text placeholder */}
              <div className="w-20 h-4 rounded-full bg-gray-200 dark:bg-[#3A3A3A] mb-4 animate-pulse" />
              {/* QR placeholder grid */}
              <div className="w-[160px] h-[160px] rounded-xl bg-gray-200 dark:bg-[#3A3A3A] animate-pulse relative overflow-hidden">
                {/* Inner circle for logo placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-[#444] animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="p-6 rounded-[32px] shadow-lg flex flex-col items-center justify-center relative w-64 h-64 border transition-all duration-300"
              style={{
                background: qrDesign.colors.background || "#FFFFFF",
                borderColor: qrDesign.colors.background === "#000000" ? "#000000" : "rgba(0,0,0,0.05)"
              }}
            >
              {qrDesign.text.position === "Top" && qrDesign.text.content && (
                <p
                  className="font-bold text-lg mb-2 mt-[-10px] text-center"
                  style={{
                    color: qrDesign.colors.background === "#000000" ? (qrDesign.colors.is_gradient ? undefined : (qrDesign.colors.foreground === "#FFFFFF" ? "#FFFFFF" : qrDesign.colors.foreground)) : (qrDesign.colors.is_gradient ? undefined : qrDesign.colors.foreground),
                    backgroundImage: qrDesign.colors.is_gradient ? qrDesign.colors.foreground : 'none',
                    WebkitBackgroundClip: qrDesign.colors.is_gradient ? 'text' : 'none',
                    WebkitTextFillColor: qrDesign.colors.is_gradient ? 'transparent' : 'initial'
                  }}
                >
                  {qrDesign.text.content}
                </p>
              )}

              <div
                className={`relative flex justify-center items-center overflow-hidden transition-all duration-300 ${qrDesign.logo.shape === "Round" ? 'rounded-full' : 'rounded-2xl'} ${qrDesign.colors.background === "#000000" && qrDesign.colors.foreground === "#FFFFFF" ? 'p-1 bg-black shadow-md' : 'rounded-lg'}`}
                style={qrDesign.colors.is_gradient ? { background: qrDesign.colors.foreground } : {}}
              >
                <QRCodeSVG
                  id="qr-code-svg"
                  value={profileUrl}
                  size={qrDesign.colors.background === "#000000" && qrDesign.colors.foreground === "#FFFFFF" ? 150 : 180}
                  level="H"
                  fgColor={qrDesign.colors.is_gradient ? "#000000" : qrDesign.colors.foreground}
                  bgColor={qrDesign.colors.background === "#000000" && qrDesign.colors.foreground === "#FFFFFF" ? "#000000" : "#FFFFFF"}
                  style={qrDesign.colors.is_gradient ? { mixBlendMode: 'screen' } : {}}
                  imageSettings={{
                    src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                    x: undefined,
                    y: undefined,
                    height: qrDesign.logo.size === "Standard" ? 54 : 36,
                    width: qrDesign.logo.size === "Standard" ? 54 : 36,
                    excavate: true,
                  }}
                />
                {/* Profile/Logo Image Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={getFullImageUrl(qrDesign.logo.url) || "https://ui-avatars.com/api/?name=Facile&background=000&color=fff"}
                    alt="Profile"
                    className={`${qrDesign.logo.size === "Standard" ? 'w-[50px] h-[50px]' : 'w-[32px] h-[32px]'} ${qrDesign.logo.shape === "Round" ? 'rounded-full' : 'rounded-lg'} border-[3px] border-white object-cover shadow-sm bg-white transition-all duration-300`}
                    onError={(e) => {
                      if (e.target.src !== "https://ui-avatars.com/api/?name=Facile&background=000&color=fff") {
                        e.target.src = "https://ui-avatars.com/api/?name=Facile&background=000&color=fff";
                      }
                    }}
                  />
                </div>
              </div>

              {qrDesign.text.position === "Bottom" && qrDesign.text.content && (
                <p
                  className="font-bold text-lg mt-3 text-center"
                  style={{
                    color: qrDesign.colors.background === "#000000" ? (qrDesign.colors.is_gradient ? undefined : (qrDesign.colors.foreground === "#FFFFFF" ? "#FFFFFF" : qrDesign.colors.foreground)) : (qrDesign.colors.is_gradient ? undefined : qrDesign.colors.foreground),
                    backgroundImage: qrDesign.colors.is_gradient ? qrDesign.colors.foreground : 'none',
                    WebkitBackgroundClip: qrDesign.colors.is_gradient ? 'text' : 'none',
                    WebkitTextFillColor: qrDesign.colors.is_gradient ? 'transparent' : 'initial'
                  }}
                >
                  {qrDesign.text.content}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Apple Wallet Button */}
        <div className="px-6 mt-8 flex justify-center">
          <button className="w-[300px] bg-black text-white dark:bg-white! dark:text-black font-semibold py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm">
            <img src={appleWallet} alt="Apple Wallet" className="w-[30px] h-auto object-contain dark:invert-0 invert" />
            Add to Apple Wallet
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-8 mt-6 mb-2 flex gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex-1 bg-white text-black dark:bg-black! dark:text-white! font-semibold py-3.5 rounded-[12px] md:rounded-[100px] flex items-center justify-center gap-2 border border-black/10 dark:border-[#444] transition shadow-sm ${isDownloading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
          >
            {isDownloading ? (
              <span className="flex items-center gap-2 animate-pulse">
                Processing...
              </span>
            ) : (
              <>
                <Download size={18} />
                Download QR
              </>
            )}
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 bg-black text-white dark:bg-white! dark:text-black! font-semibold py-3 rounded-[12px] md:rounded-[100px] flex items-center justify-center gap-2 hover:bg-gray-900 dark:hover:bg-gray-100 transition shadow-sm border border-transparent"
          >
            <Edit2 size={18} />
            Edit QR
          </button>
        </div>

      </div>

      <EditQRCodeModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        username={username}
        initialProfileImage={profileImage}
        userProfileId={userProfileId}
        onUpdate={() => {
          // Re-fetch design after update
          const fetchDesign = async () => {
            try {
              const res = await getQRDesign(userProfileId);
              if (res.data?.data?.qr_design) {
                setQrDesign(res.data.data.qr_design);
              }
            } catch (err) {
              console.error("Failed to fetch QR design", err);
            }
          };
          fetchDesign();
        }}
      />
    </div>
  );
}

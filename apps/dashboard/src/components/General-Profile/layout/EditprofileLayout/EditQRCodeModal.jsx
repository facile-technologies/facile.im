import React, { useState, useRef, useEffect } from "react";
import { X, Pencil, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ColorPicker from "react-best-gradient-color-picker";
import { getQRDesign, updateQRDesign } from "@/services/qr";
import { showToast } from "@/store/utils/toast";

export default function EditQRCodeModal({ isOpen, onClose, username, initialProfileImage, userProfileId, onUpdate }) {
  const [logoImage, setLogoImage] = useState(initialProfileImage);
  const [logoSize, setLogoSize] = useState("Standard"); // Standard, Small
  const [logoShape, setLogoShape] = useState("Round"); // Round, Square
  const [textPosition, setTextPosition] = useState("Top"); // Top, Bottom
  const [qrText, setQrText] = useState("Scan Me");
  const [qrColor, setQrColor] = useState("#000000"); // default black
  const [bgColor, setBgColor] = useState("#FAFAFA");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const fileInputRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Fetch existing design on open
  useEffect(() => {
    if (isOpen && userProfileId) {
      const fetchDesign = async () => {
        try {
          const res = await getQRDesign(userProfileId);
          if (res.data?.data?.qr_design) {
            const design = res.data.data.qr_design;
            if (design.logo?.url) setLogoImage(design.logo.url);
            if (design.logo?.size) setLogoSize(design.logo.size);
            if (design.logo?.shape) setLogoShape(design.logo.shape);
            if (design.text?.content) setQrText(design.text.content);
            if (design.text?.position) setTextPosition(design.text.position);
            if (design.colors?.foreground) setQrColor(design.colors.foreground);
            if (design.colors?.background) setBgColor(design.colors.background);
          }
        } catch (err) {
          console.error("Failed to fetch design", err);
        }
      };
      fetchDesign();
    }
  }, [isOpen, userProfileId]);

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const profileUrl = `facile.in/${username}`;

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.facile.im";
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanUrl = url.replace(/^\//, "");

    if (cleanUrl.startsWith("uploads")) {
      return `${cleanBase}/${cleanUrl}`;
    }
    return `${cleanBase}/uploads/${cleanUrl}`;
  };

  const colors = [
    "#000000", "#FFFFFF", "#A3B1C6", "#2B2B2B",
    "#EF5350", "#FFA726", "#FFEE58", "#66BB6A",
    "#42A5F5", "#AB47BC"
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onload = (event) => setLogoImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!userProfileId) {
      console.warn("[EditQRCodeModal] userProfileId is missing. Update aborted.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_profile_id", userProfileId);
      if (fileToUpload) {
        formData.append("logo_file", fileToUpload);
      }
      formData.append("logo_size", logoSize);
      formData.append("logo_shape", logoShape);
      formData.append("text_content", qrText);
      formData.append("text_position", textPosition);
      formData.append("qr_color", qrColor);
      formData.append("bg_color", bgColor);
      formData.append("is_gradient", qrColor.includes("gradient"));

      await updateQRDesign(formData);
      showToast("success", "QR design updated successfully");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to update QR design", err);
      showToast("error", err.response?.data?.message || "Failed to update QR design");
    } finally {
      setLoading(false);
    }
  };

  const currentLogoWidth = logoSize === "Standard" ? 54 : 36;

  const isBlack = qrColor.toLowerCase() === '#000000' || qrColor.toLowerCase() === '#000';
  const isWhite = qrColor.toLowerCase() === '#ffffff' || qrColor.toLowerCase() === '#fff';
  const isGradient = qrColor.includes('gradient');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#FAFAFA] dark:bg-[#2A2A2A] w-full max-w-[800px] rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-black/5 dark:border-white/10">
          <h2 className="text-black dark:text-white text-xl font-semibold">Edit QR</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:!text-gray-400 dark:hover:text-white transition bg-transparent!">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">

          {/* Top Row - Custom Logo & Preview */}
          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[400px]">

            {/* Custom Logo Section */}
            <div className="flex-1 bg-white dark:bg-[#333] p-4 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-start justify-start shadow-sm dark:shadow-none">
              <h3 className="text-black dark:text-white font-semibold mb-1 w-full text-left">Custom Logo</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 mt-1 w-full text-left max-w-[90%] leading-relaxed">Add custom logo to be displayed in the middle of the facile profile QR Code.</p>

              <div className="flex flex-col items-center gap-8 w-full mt-1">
                <div
                  className={`relative w-[110px] h-[110px] bg-gray-100 dark:bg-[#676B74] rounded-full flex items-center justify-center cursor-pointer group shrink-0 ${!logoImage ? 'border-2 border-dashed border-gray-300 dark:border-gray-400' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoImage ? (
                    <img src={getFullImageUrl(logoImage)} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-gray-400 dark:text-white font-semibold text-lg">Logo</span>
                  )}
                  <div className="absolute bottom-0 right-1 bg-white dark:bg-black w-8 h-8 flex items-center justify-center rounded-full shadow-md border border-gray-200 dark:border-2 dark:border-[#2A2A2A]">
                    <Pencil size={13} className="text-gray-700 dark:text-white" />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>

                <div className="w-full flex flex-col gap-3">
                  {/* Logo Size Toggle */}
                  <div className="flex justify-between items-center bg-[#F5F5F5] dark:bg-[#2A2A2A] p-2 pl-4 rounded-xl w-full border border-black/5 dark:border-white/5 shadow-inner">
                    <span className="text-[13px] text-gray-800 dark:text-white font-medium">Logo Size</span>
                    <div className="flex bg-[#EAEAEA] dark:bg-[#303030] rounded-full p-1 gap-1">
                      <button
                        className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition ${logoSize === "Standard" ? "bg-white text-black shadow-sm dark:!bg-black dark:!text-white" : "text-gray-500 hover:text-black bg-transparent dark:!text-gray-500 dark:hover:text-black dark:!bg-transparent"}`}
                        onClick={() => setLogoSize("Standard")}
                      >
                        Standard
                      </button>
                      <button
                        className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition ${logoSize === "Small" ? "bg-white text-black shadow-sm dark:!bg-black dark:!text-white" : "text-gray-500 hover:text-black bg-transparent dark:!text-gray-500 dark:hover:text-black dark:!bg-transparent"}`}
                        onClick={() => setLogoSize("Small")}
                      >
                        Small
                      </button>
                    </div>
                  </div>

                  {/* Logo Shape Toggle */}
                  <div className="flex justify-between items-center bg-[#F5F5F5] dark:bg-[#2A2A2A] p-2 pl-4 rounded-xl w-full border border-black/5 dark:border-white/5 shadow-inner">
                    <span className="text-[13px] text-gray-800 dark:text-white font-medium">Logo Shape</span>
                    <div className="flex bg-[#EAEAEA] dark:bg-[#303030] rounded-full p-1 gap-1">
                      <button
                        className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition ${logoShape === "Round" ? "bg-white text-black shadow-sm dark:!bg-black dark:!text-white" : "text-gray-500 hover:text-black bg-transparent dark:!text-gray-500 dark:hover:text-black dark:!bg-transparent"}`}
                        onClick={() => setLogoShape("Round")}
                      >
                        Round
                      </button>
                      <button
                        className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition ${logoShape === "Square" ? "bg-white text-black shadow-sm dark:!bg-black dark:!text-white" : "text-gray-500 hover:text-black bg-transparent dark:!text-gray-500 dark:hover:text-black dark:!bg-transparent"}`}
                        onClick={() => setLogoShape("Square")}
                      >
                        Square
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="w-[320px] shrink-0 bg-white dark:bg-[#333] rounded-3xl p-6 flex flex-col items-center justify-center border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none relative mx-auto md:mx-0 transition-all duration-300">
              <div
                className="w-full rounded-[20px] flex flex-col items-center justify-center p-5 pt-4 transition-all duration-300"
                style={{
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  ...(isBlack || isWhite ? {
                    backgroundColor: '#FAFAFA',
                    borderColor: 'rgba(0,0,0,0.15)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  } : isGradient ? {
                    background: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)) padding-box, ${qrColor} border-box`,
                    borderColor: 'transparent',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                  } : {
                    backgroundColor: `color-mix(in srgb, ${qrColor}, white 92%)`,
                    borderColor: qrColor,
                    boxShadow: `0 4px 14px color-mix(in srgb, ${qrColor}, transparent 80%)`
                  })
                }}
              >
                {textPosition === "Top" && qrText && (
                  <p
                    className="font-bold text-[18px] mb-3 transition-colors"
                    style={{
                      color: isWhite ? '#000000' : (isGradient ? undefined : qrColor),
                      backgroundImage: isGradient ? qrColor : 'none',
                      WebkitBackgroundClip: isGradient ? 'text' : 'none',
                      WebkitTextFillColor: isGradient ? 'transparent' : 'initial'
                    }}
                  >
                    {qrText}
                  </p>
                )}

                <div
                  className={`relative flex justify-center items-center overflow-hidden rounded-xl transition-all duration-300 ${isWhite ? 'p-4 bg-black shadow-lg' : ''}`}
                  style={isGradient ? { background: qrColor } : {}}
                >
                  <QRCodeSVG
                    value={profileUrl}
                    size={isWhite ? 170 : 200}
                    level="H"
                    fgColor={isGradient ? "#000000" : (isWhite ? "#FFFFFF" : qrColor)}
                    bgColor={isWhite ? "#000000" : "#FFFFFF"}
                    style={isGradient ? { mixBlendMode: 'screen' } : {}}
                    imageSettings={{
                      src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                      x: undefined,
                      y: undefined,
                      height: currentLogoWidth + 8,
                      width: currentLogoWidth + 8,
                      excavate: true,
                    }}
                  />

                  {logoImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={getFullImageUrl(logoImage)}
                        alt="Logo"
                        style={{
                          width: currentLogoWidth,
                          height: currentLogoWidth,
                          borderRadius: logoShape === "Round" ? '9999px' : '8px'
                        }}
                        className="object-cover border-[3px] border-white bg-white shadow-sm"
                        onError={(e) => {
                          if (e.target.src !== "https://ui-avatars.com/api/?name=Facile&background=000&color=fff") {
                            e.target.src = "https://ui-avatars.com/api/?name=Facile&background=000&color=fff";
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {textPosition === "Bottom" && qrText && (
                  <p
                    className="font-bold text-[18px] mt-4 transition-colors"
                    style={{
                      color: isWhite ? '#000000' : (isGradient ? undefined : qrColor),
                      backgroundImage: isGradient ? qrColor : 'none',
                      WebkitBackgroundClip: isGradient ? 'text' : 'none',
                      WebkitTextFillColor: isGradient ? 'transparent' : 'initial'
                    }}
                  >
                    {qrText}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Row - Full Width Controls */}
          <div className="flex flex-col gap-6 w-full">

            {/* Text Customization */}
            <div className="flex flex-col gap-3 bg-white dark:bg-[#303030] shadow-sm dark:shadow-none border border-black/5 dark:border-transparent p-4 rounded-3xl">
              <h3 className="text-black dark:text-white font-semibold text-sm px-1">Text Customization</h3>

              <div className="bg-[#F5F5F5] dark:bg-[#2A2A2A] px-5 py-3 rounded-2xl flex justify-between items-center border border-black/5 dark:border-white/5">
                <span className="text-[14px] text-gray-800 dark:text-white font-semibold">Text Position</span>
                <div className="flex bg-[#EAEAEA] dark:bg-[#303030] rounded-full p-1 gap-1">
                  <button
                    className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition ${textPosition === "Top" ? "bg-white text-black shadow-sm dark:!bg-black dark:!text-white" : "text-gray-500 hover:text-black bg-transparent dark:!text-gray-500 dark:hover:text-black dark:!bg-transparent"}`}
                    onClick={() => setTextPosition("Top")}
                  >
                    Top
                  </button>
                  <button
                    className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition ${textPosition === "Bottom" ? "bg-white text-black shadow-sm dark:!bg-black dark:!text-white" : "text-gray-500 hover:text-black bg-transparent dark:!text-gray-500 dark:hover:text-black dark:!bg-transparent"}`}
                    onClick={() => setTextPosition("Bottom")}
                  >
                    Bottom
                  </button>
                </div>
              </div>

              <div className="bg-[#F5F5F5] dark:bg-[#2A2A2A] px-5 py-3 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Text</label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-black dark:text-white text-sm font-medium"
                  placeholder="Enter QR text"
                />
              </div>
            </div>

            {/* Customize QR Color */}
            <div className="w-full bg-white dark:bg-[#333] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-black dark:text-white font-semibold text-sm">Customize QR Color</h3>
                <button
                  onClick={() => setQrColor("#000000")}
                  className="flex items-center gap-1.5 text-xs !text-gray-500 hover:text-black dark:text-[#C8C8C8] dark:hover:text-white transition font-medium bg-transparent!"
                >
                  <RotateCcw size={13} />
                  Reset colors to default
                </button>
              </div>
              <div className="flex gap-3 flex-wrap items-center relative">
                {/* Custom Color Picker Dot */}
                <div
                  className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 border relative overflow-hidden transition cursor-pointer ${!colors.includes(qrColor)
                    ? 'ring-2 ring-black dark:ring-white ring-offset-[3px] ring-offset-[#F5F5F5] dark:ring-offset-[#2A2A2A] border-transparent shadow-md'
                    : 'border-transparent dark:border-none shadow-sm hover:shadow-md bg-linear-to-tr from-[#FF512F] via-[#DD2476] to-[#4568DC]'
                    }`}
                  style={{ background: !colors.includes(qrColor) ? qrColor : undefined }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Pencil size={11} className={`z-10 pointer-events-none drop-shadow-md ${!colors.includes(qrColor) ? 'text-white mix-blend-difference' : 'text-white'}`} />
                </div>

                {/* Popover Color Picker */}
                {showColorPicker && (
                  <div className="absolute z-50 bottom-full mb-3 left-0 shadow-xl rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#2A2A2A] p-3 w-[290px]" ref={colorPickerRef}>
                    <ColorPicker
                      value={qrColor}
                      onChange={(c) => {
                        setQrColor(c);
                        const isBlack = c.toLowerCase() === '#000000' || c.toLowerCase() === '#000';
                        const isWhite = c.toLowerCase() === '#ffffff' || c.toLowerCase() === '#fff';
                        if (isBlack || isWhite) {
                          setBgColor('#FAFAFA');
                        } else if (!c.includes('gradient')) {
                          setBgColor(`color-mix(in srgb, ${c}, white 92%)`);
                        } else {
                          setBgColor('rgba(255,255,255,0.92)');
                        }
                      }}
                      width={266}
                      height={180}
                      hidePresets
                      hideEyeDrop
                    />
                  </div>
                )}

                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setQrColor(c);
                      const isBlack = c.toLowerCase() === '#000000' || c.toLowerCase() === '#000';
                      const isWhite = c.toLowerCase() === '#ffffff' || c.toLowerCase() === '#fff';
                      if (isBlack || isWhite) {
                        setBgColor('#FAFAFA');
                      } else {
                        setBgColor(`color-mix(in srgb, ${c}, white 92%)`);
                      }
                    }}
                    className={`w-[26px] h-[26px] rounded-full shrink-0 transition-transform ${qrColor === c ? 'ring-[2px] ring-black dark:ring-white ring-offset-[3px] ring-offset-[#F5F5F5] dark:ring-offset-[#2A2A2A]' : ''}`}
                    style={{ backgroundColor: c, border: c === "#000000" && qrColor !== "#000000" ? '1px solid #444' : c === "#FFFFFF" && qrColor !== "#FFFFFF" ? '1px solid #ddd' : 'none' }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-6 pt-3 border-t border-black/5 dark:border-white/10 mt-auto">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-100 dark:bg-[#E5E5E5] text-black font-medium hover:bg-gray-200 dark:hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="px-8 py-2.5 rounded-full bg-black text-white dark:bg-white! dark:text-black! hover:bg-gray-800 dark:hover:bg-gray-100 transition font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}

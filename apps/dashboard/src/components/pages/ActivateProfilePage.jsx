import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfilesByCode, activateDevice, activatePhysicalDevice } from "../../services/device";
import Loader from "../../store/utils/Loader";
import { showToast } from "../../store/utils/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, QrCode, Nfc, Camera, X, AlertTriangle } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function ActivateProfilePage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedDeviceCode, setScannedDeviceCode] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showNfcPrompt, setShowNfcPrompt] = useState(false);
  const [nfcError, setNfcError] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getProfilesByCode(code);
        if (response.data.success) {
          setProfiles(response.data.profiles || []);
          setUser(response.data.user);
        } else {
          if (response.data.message?.toLowerCase().includes("expired")) {
            setIsExpired(true);
          } else {
            showToast("error", response.data.message || "Invalid code.");
          }
        }
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        const errorMessage = error.response?.data?.message || "";
        if (errorMessage.toLowerCase().includes("expired")) {
          setIsExpired(true);
        } else {
          showToast("error", errorMessage || "Failed to load profiles. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchProfiles();
    }
  }, [code]);

  const handleLinkClick = () => {
    if (!selectedProfileId) {
      showToast("error", "Please select a profile to activate.");
      return;
    }
    setShowOptions(true);
  };

  const handleActivate = async () => {
    // This is for the "Tap Device" or legacy flow (using the code from URL)
    setShowOptions(false);
    setActivating(true);
    try {
      const response = await activateDevice(code, selectedProfileId);
      if (response.data.success) {
        setIsSuccess(true);
        showToast("success", "Device activated successfully!");
        setTimeout(() => navigate("/devices"), 3000);
      } else {
        showToast("error", response.data.message || "Activation failed.");
      }
    } catch (error) {
      console.error("Activation error:", error);
      showToast("error", "An error occurred during activation.");
    } finally {
      setActivating(false);
    }
  };

  const startScanner = () => {
    setShowOptions(false);
    setShowScanner(true);
  };

  const handleScanSuccess = (decodedText) => {
    // Extract code from URLs like http://72.61.77.17/SZXSEKK5RZ
    try {
      const url = new URL(decodedText.trim());
      const segments = url.pathname.split('/').filter(Boolean);
      const code = segments[segments.length - 1];
      if (code && code.length >= 5) {
        setScannedDeviceCode(code);
        setShowScanner(false);
        setShowConfirmDialog(true);
      } else {
        showToast("error", "Invalid QR code format.");
      }
    } catch {
      // Not a URL — try treating the raw value as the code
      const code = decodedText.trim();
      if (code && code.length >= 5) {
        setScannedDeviceCode(code);
        setShowScanner(false);
        setShowConfirmDialog(true);
      } else {
        showToast("error", "Invalid QR code format.");
      }
    }
  };

  const startNfcScan = async () => {
    setShowOptions(false);

    if (!window.isSecureContext) {
      showToast("error", "NFC requires a secure connection (HTTPS).");
      return;
    }

    if (!('NDEFReader' in window)) {
      showToast("error", "NFC is not supported on this device or browser.");
      return;
    }

    setShowNfcPrompt(true);
    setNfcError("");
  };

  const handleConfirmActivation = async () => {
    setShowConfirmDialog(false);
    setActivating(true);
    try {
      const response = await activatePhysicalDevice(scannedDeviceCode, selectedProfileId);
      if (response.data.success) {
        setIsSuccess(true);
        showToast("success", "Device linked successfully!");
        setTimeout(() => navigate("/devices"), 3000);
      } else {
        showToast("error", response.data.message || "Activation failed.");
      }
    } catch (error) {
      console.error("Physical activation error:", error);
      const msg = error.response?.data?.message || "An error occurred during activation.";
      showToast("error", msg);
    } finally {
      setActivating(false);
    }
  };

  if (loading) return <Loader />;

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="bg-[#1A1A1A] rounded-[40px] p-10 flex flex-col items-center text-center max-w-md w-full shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
            <QrCode className="w-12 h-12 text-gray-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-0.5 bg-red-500/50 rotate-45"></div>
            </div>
          </div>
          <h1 className="text-3xl font-black mb-4 tracking-tighter uppercase">LINK EXPIRED</h1>
          <p className="text-gray-400 mb-10 leading-relaxed text-sm">
            This activation link has timed out for security reasons. Please generate a new QR code on your desktop to continue.
          </p>
          <div className="w-full space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">1</div>
              <p className="text-[11px] text-gray-400">Scan a fresh QR code from your dashboard</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">2</div>
              <p className="text-[11px] text-gray-400">Complete the profile selection again</p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          Facile © 2026
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="bg-[#1A1A1A] rounded-[40px] p-10 flex flex-col items-center text-center max-w-md w-full shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">SUCCESS!</h1>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Your device has been linked to your profile perfectly. We're taking you to your dashboard now.
          </p>
          <Button
            onClick={() => navigate("/devices")}
            className="w-full bg-white text-black hover:bg-white/90 rounded-[22px] h-16 text-lg font-black transition-all transform active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            Go to Devices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-start py-12 px-5 text-white font-sans relative">
      {/* Premium Container */}
      <div className="max-w-lg w-full bg-[#1A1A1A] rounded-[40px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-8 md:p-10">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-10 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <img src="/facile.svg" alt="Facile" className="h-8 filter brightness-200" />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 border border-white/20">
            <QrCode className="w-3 h-3" />
            New Device Link
          </div>

          <h1 className="text-3xl font-black mb-4 tracking-tight leading-tight">Activate Device</h1>

          <div className="h-0.5 w-12 bg-white/30 rounded-full mb-6"></div>

          <p className="text-gray-400 text-sm leading-relaxed px-4 text-balance">
            {user ? (
              <>Hello <span className="text-white font-bold">{user.full_name}</span>, please select the profile you want to link with this device.</>
            ) : "Please select the profile you want to link with your new device."}
          </p>
        </div>

        {/* Profiles List */}
        <div className="space-y-4 mb-10 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {profiles.length === 0 ? (
            <div className="bg-white/5 rounded-3xl p-10 text-center border border-white/5 backdrop-blur-sm">
              <p className="text-gray-400 text-sm mb-6">No profiles found for your account.</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                className="relative cursor-pointer transition-all duration-300 transform active:scale-[0.98]"
              >
                <div className={`p-5 flex items-center gap-4 rounded-[28px] transition-all duration-300 border-2
                  ${selectedProfileId === profile.id
                    ? "bg-[#2D2D2D] border-white shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                    : "bg-[#252525] border-transparent hover:border-white/10 hover:bg-[#2A2A2A] shadow-lg"}
                `}>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#3F3F3F] shrink-0 border-2 border-white/10 shadow-inner p-0.5">
                    <img
                      src={profile.profile_image || profile.user?.avatar || "/pro-image.jpg"}
                      alt={profile.profile_name}
                      className="w-full h-full object-cover rounded-[14px]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/pro-image.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-extrabold text-white truncate leading-none mb-1">
                      {profile.user?.full_name}
                    </h3>
                    <p className={`text-[10px] uppercase tracking-widest font-black transition-colors
                      ${selectedProfileId === profile.id ? "text-white" : "text-gray-500"}
                    `}>
                      {profile.profile_type}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${selectedProfileId === profile.id ? "bg-white border-white shadow-white/20" : "border-white/10 bg-white/5"}
                  `}>
                    {selectedProfileId === profile.id && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <Button
            onClick={handleLinkClick}
            disabled={!selectedProfileId || activating}
            className={`w-full h-14 text-lg font-black rounded-[22px] transition-all duration-500 relative overflow-hidden group
              ${selectedProfileId && !activating
                ? "bg-white text-black hover:bg-white/90 shadow-[0_15px_40px_rgba(255,255,255,0.1)] translate-y-0 opacity-100"
                : "bg-white/10 text-white/20 translate-y-4 opacity-50 blur-[1px]"}
            `}
          >
            {activating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
                <span>Linking...</span>
              </div>
            ) : (
              "Link Device"
            )}
          </Button>

          <p className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">
            Facile © 2026
          </p>
        </div>
      </div>

      {/* Bottom Drawer Overlay */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-0">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowOptions(false)} />
          <div className="relative w-full max-w-lg bg-[#1A1A1A] border-t border-white/10 rounded-t-[40px] p-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300 ease-out pb-14 text-center">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-10"></div>
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">Activate Device</h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                You can close the browser or switch apps — we'll save your info, so you won't lose progress.
              </p>
            </div>
            <div className="space-y-6">
              <button onClick={startScanner} className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-[18px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] font-black text-md shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                <Camera className="w-5 h-5" />
                Scan QR code
              </button>
              <p onClick={startNfcScan} className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer mx-auto inline-block">
                or tap your device now
              </p>
            </div>
            <button onClick={() => setShowOptions(false)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* QR Scanner Overlay */}
      {showScanner && (
        <QRScannerComponent onSuccess={handleScanSuccess} onClose={() => setShowScanner(false)} />
      )}

      {/* NFC Prompt Overlay */}
      {showNfcPrompt && (
        <NfcPromptOverlay onSuccess={handleScanSuccess} onClose={() => setShowNfcPrompt(false)} />
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 animate-in fade-in duration-300 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowConfirmDialog(false)} />
          <div className="relative w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Link this Device?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 px-2">
              Do you really want to map this device with <span className="text-white font-black">{profiles.find(p => p.id === selectedProfileId)?.profile_name}</span>?
            </p>
            <div className="space-y-4">
              <Button onClick={handleConfirmActivation} disabled={activating} className="w-full h-16 bg-white text-black font-black rounded-[22px] hover:bg-white/90 text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all">
                {activating ? "Linking..." : "Yes, Link it"}
              </Button>
              <button onClick={() => setShowConfirmDialog(false)} className="w-full text-gray-500 hover:text-white transition-colors text-sm font-bold tracking-wide py-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QRScannerComponent({ onSuccess, onClose }) {
  const [error, setError] = useState("");

  useEffect(() => {
    let html5QrCode;
    const startScanner = async () => {
      // Check if the context is secure (HTTPS or localhost)
      if (!window.isSecureContext) {
        setError("Camera access requires a secure connection (HTTPS). Please test on localhost or via HTTPS.");
        return;
      }

      // Small delay to ensure the 'reader' element is fully mounted
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        const element = document.getElementById("reader");
        if (!element) return;

        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          async (decodedText) => {
            onSuccess(decodedText);
            if (html5QrCode.getState() === 2) await html5QrCode.stop();
          },
          () => { }
        );
      } catch (err) {
        console.error("Scanner start error:", err);
        setError("Camera access denied or device not found. Please check permissions.");
      }
    };
    startScanner();
    return () => {
      if (html5QrCode && html5QrCode.getState() === 2) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-70 flex flex-col bg-black animate-in fade-in duration-300">
      <div className="p-8 flex items-center justify-between border-b border-white/5 bg-[#0F0F0F]">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Scan Device</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0F0F0F] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
        <div className="relative z-0 w-full max-w-sm">
          <div id="reader" className="w-full rounded-[40px] overflow-hidden border-4 border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)] bg-black" />
          <div className="absolute inset-0 border-2 border-white/10 rounded-[40px] pointer-events-none">
            <div className="absolute top-10 left-10 w-8 h-8 border-t-4 border-l-4 border-white/40 rounded-tl-xl" />
            <div className="absolute top-10 right-10 w-8 h-8 border-t-4 border-r-4 border-white/40 rounded-tr-xl" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-4 border-l-4 border-white/40 rounded-bl-xl" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-4 border-r-4 border-white/40 rounded-br-xl" />
          </div>
        </div>
        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-xs transition-all animate-in slide-in-from-top">
            <p className="text-red-500 text-xs font-black text-center uppercase tracking-widest">{error}</p>
          </div>
        )}
        <div className="mt-12 text-center max-w-[280px]">
          <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed mb-4">ALIGN QR CODE WITHIN FRAME</p>
          <p className="text-gray-600 text-[10px] leading-relaxed">Scanning will automatically extract the device ID and continue activation.</p>
        </div>
      </div>
    </div>
  );
}

function NfcPromptOverlay({ onSuccess, onClose }) {
  const [status, setStatus] = useState("ready"); // ready, error, success

  useEffect(() => {
    let ndef;
    const startNfc = async () => {
      try {
        ndef = new window.NDEFReader();
        await ndef.scan();

        ndef.onreading = (event) => {
          const { message } = event;
          for (const record of message.records) {
            if (record.recordType === "url") {
              const decoder = new TextDecoder();
              const url = decoder.decode(record.data);
              onSuccess(url);
              return;
            }
          }
          // If no URL record found but tag scanned
          showToast("error", "No valid device info found on this tag.");
        };
      } catch (error) {
        console.error("NFC Error:", error);
        setStatus("error");
      }
    };

    startNfc();

    return () => {
      // NDEFReader doesn't have a stop() method, it stops when the page is closed/backgrounded
    };
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300 text-center">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 relative overflow-hidden">
          <Nfc className={`w-12 h-12 text-white ${status === 'ready' ? 'animate-pulse' : ''}`} />
          {status === 'ready' && (
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping duration-1000" />
          )}
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Ready to Tap</h2>

        {status === 'error' ? (
          <p className="text-red-500 text-sm leading-relaxed mb-8 px-4 font-bold">
            Failed to start NFC. Please ensure NFC is enabled in your device settings.
          </p>
        ) : (
          <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
            Hold your device near the physical tag to link it to your profile.
          </p>
        )}

        <Button onClick={onClose} className="w-full h-14 bg-white/5 text-white/50 hover:text-white font-black rounded-[18px] transition-all">
          Cancel
        </Button>
      </div>
    </div>
  );
}

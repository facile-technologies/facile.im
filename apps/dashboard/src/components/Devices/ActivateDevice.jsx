import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "../ui/card";

export default function ActivateDevice({ activationCode, activationStatus }) {
  const activationLink = `${window.location.origin}/activate/${activationCode}`;

  return (
    <Card className={"bg-white border border-gray-100 dark:bg-[#303030] dark:border-0 rounded-[32px] mt-8 overflow-hidden relative shadow-sm dark:shadow-none"}>
      <CardContent className={"p-8 relative min-h-[420px] flex flex-col justify-center"}>
        {/* QR Section (Always in background) */}
        <div className={`transition-all duration-500 ${activationStatus === "SCANNED" ? "blur-md opacity-40 scale-95" : "blur-0 opacity-100 scale-100"}`}>
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">Activate Device</h2>
            <p className="text-sm text-gray-500 dark:text-[#AAAAAA] mt-1">
              Scan the QR code from your phone to complete activation.
            </p>
          </div>

          <div className="flex justify-center">
            {activationCode ? (
              <div className="bg-white p-5 rounded-[24px] shadow-2xl relative group">
                <QRCodeSVG
                  value={activationLink}
                  size={200}
                  level="M"
                  includeMargin={false}
                />
                <div className="absolute inset-0 border-4 border-black/5 rounded-[24px]"></div>
              </div>
            ) : (
              <div className="w-[240px] h-[240px] bg-gray-50 dark:bg-[#222] rounded-[24px] flex items-center justify-center border border-dashed border-gray-200 dark:border-white/10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-300 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                  <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Generating...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Waiting Overlay */}
        {activationStatus === "SCANNED" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center text-center px-6">
              {/* Premium Spinner */}
              <div className="mb-8 relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-white animate-spin"></div>
              </div>

              <h2 className="text-3xl font-bold text-black dark:text-white mb-3 tracking-tight">
                Waiting to activate
              </h2>
              <p className="text-black dark:text-white text-sm max-w-[400px] leading-relaxed">
                Scan the QR code from your phone to complete activation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

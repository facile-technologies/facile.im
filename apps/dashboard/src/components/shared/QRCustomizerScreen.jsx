import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import QRCode from "react-qr-code";
import { QRCodeSVG } from "qrcode.react";

export default function QRCustomizerScreen({ onClose }) {
  const [qrText, setQrText] = useState("https://reactjs.org/");
  return (
    <div className="w-full h-full bg-[#1B1B1B] p-4 flex flex-col items-center rounded-2xl">
      {/* Top Bar */}
      <div className="w-full max-w-[813px] flex items-center justify-between mb-4 ">
        <h2 className="text-2xl font-semibold">Facile.share</h2>
        <a
          type="button"
          className=" top-3 right-3 text-white text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </a>
      </div>
      <div className="bg-[#2A2A2A] rounded-2xl p-2 w-full max-w-[813px] shadow-xl flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col w-full md:w-[55%] gap-2">
            <div className="w-full bg-[#303030] rounded-2xl p-4">
              <h2 className="text-lg font-semibold mb-1">Custom Logo</h2>
              <p className="text-[12px] text-gray-300 mb-4">
                Add custom logo to be displayed in the middle of the facile
                profile QR Code.
              </p>

              {/* Centered Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-[105px] h-[105px] bg-gray-500 rounded-full flex items-center justify-center relative">
                  <span>Logo</span>
                  <a className="absolute bottom-2 right-2 bg-black p-1.5 rounded-full">
                    <Edit2 size={16} className="text-white" />
                  </a>
                </div>
              </div>

              {/* Logo Size Buttons */}
              <div className="bg-[#1F1F1F] p-3 rounded-xl flex justify-between mb-3 w-full">
                <a className="px-4 py-1.5 rounded-xl bg-black text-sm">
                  Standard
                </a>
                <a className="px-4 py-1.5 rounded-xl bg-[#3A3A3A] text-sm">
                  Small
                </a>
              </div>

              {/* Logo Shape Buttons */}
              <div className="bg-[#1F1F1F] p-3 rounded-xl flex justify-between w-full">
                <a className="px-4 py-1.5 rounded-xl bg-black text-sm">Round</a>
                <a className="px-4 py-1.5 rounded-xl bg-[#3A3A3A] text-sm">
                  Square
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – QR PREVIEW */}
          <div className="flex bg-[#303030] justify-center items-center rounded-2xl w-full md:w-[45%] p-4">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center w-[300px] h-[300px] p-2">
              <p className="text-black text-sm font-semibold mb-2">Scan Me</p>
              <QRCodeSVG
                value={qrText}
                size={250}
                bgColor="#fff"
                fgColor="#000"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Full Width */}
        <div className="flex flex-col gap-6 w-full">
          {/* Text Customization */}
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Text Customization</h2>
            <div className="flex items-center justify-between bg-[#1F1F1F] p-3 rounded-xl mb-3 w-full">
              <span className="text-sm text-gray-300">Text Position</span>
              <div className="flex gap-2">
                <a className="px-4 py-1.5 rounded-xl bg-black text-sm">Top</a>
                <a className="px-4 py-1.5 rounded-xl bg-[#3A3A3A] text-sm">
                  Bottom
                </a>
              </div>
            </div>
            <input
              className="w-full bg-[#1F1F1F] h-[45px] rounded-xl px-3 text-sm outline-none"
              placeholder="Scan Me"
            />
          </div>

          {/* Customize QR Color */}
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Customize QR Color</h2>
            <div className="bg-[#1F1F1F] p-4 rounded-xl flex items-center gap-3 flex-wrap w-full">
              {[
                "#FFFFFF",
                "#BCC0C6",
                "#A3B8D0",
                "#000000",
                "#D94F3D",
                "#E19A39",
                "#E4D047",
                "#4CAF50",
                "#B455E0",
              ].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full cursor-pointer border border-gray-600"
                  style={{ backgroundColor: c }}
                />
              ))}
              <a className="text-xs text-gray-300 ml-auto underline">
                Reset colors to default
              </a>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="w-full flex justify-between gap-3 mt-2">
            <button className="w-1/2 bg-white text-black h-[55px] rounded-full text-sm font-semibold">
              Add to apple wallet
            </button>
            <button className="w-1/2 bg-white text-black h-[55px] rounded-full text-sm font-semibold">
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

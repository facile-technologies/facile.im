import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";

export default function ColorPickerPopUp({ currentColor, onSelect, onClose }) {
  const [color, setColor] = useState(currentColor);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });

  // Update state when currentColor changes
  useEffect(() => {
    setColor(currentColor);
    const c = hexToRgb(currentColor);
    setRgb(c);
  }, [currentColor]);

  // Convert HEX to RGB with added validation
  const hexToRgb = (hex) => {
    if (!hex || typeof hex !== "string" || !/^#[0-9A-F]{6}$/i.test(hex)) {
      console.error("Invalid hex color value:", hex);
      return { r: 0, g: 0, b: 0 }; // Return default black color
    }
    const cleanHex = hex.replace("#", "");
    return {
      r: parseInt(cleanHex.slice(0, 2), 16),
      g: parseInt(cleanHex.slice(2, 4), 16),
      b: parseInt(cleanHex.slice(4, 6), 16),
    };
  };

  // Convert RGB to HEX
  const rgbToHex = ({ r, g, b }) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  // Handle ChromePicker change
  const handleChromeChange = (col) => {
    setColor(col.hex);
    setRgb(col.rgb);
  };

  // Handle RGB input change
  const handleRgbChange = (e, channel) => {
    const value = Math.min(255, Math.max(0, Number(e.target.value)));
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    setColor(rgbToHex(newRgb));
  };

  // Handle HEX input change
  const handleHexChange = (e) => {
    const hex = e.target.value;
    setColor(hex);
    setRgb(hexToRgb(hex));
  };

  const handleDone = () => {
    onSelect(color);
    onClose();
  };

  return (
    <div className="w-[400px] bg-[#1C1C1C] rounded-[20px] p-6 shadow-2xl text-white space-y-4">
      {/* Chrome Picker */}
      <div className="rounded-xl overflow-hidden bg-[#111]">
        <ChromePicker
          color={color}
          onChange={handleChromeChange}
          disableAlpha={true}
          styles={{
            default: {
              picker: {
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              },
            },
          }}
        />
      </div>

      {/* HEX / RGB Inputs */}
      <div className="flex flex-col gap-3 mt-3">
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col">
            <label className="w-12 text-gray-300">Hex</label>
            <input
              className="flex-1 bg-[#2A2A2A] p-3 rounded-lg outline-none text-white"
              value={color}
              onChange={handleHexChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">R</label>
            <input
              type="number"
              min={0}
              max={255}
              className="bg-[#2A2A2A] p-3 rounded-lg outline-none text-white"
              value={rgb.r}
              onChange={(e) => handleRgbChange(e, "r")}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">G</label>
            <input
              type="number"
              min={0}
              max={255}
              className="bg-[#2A2A2A] p-3 rounded-lg outline-none"
              value={rgb.g}
              onChange={(e) => handleRgbChange(e, "g")}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">B</label>
            <input
              type="number"
              min={0}
              max={255}
              className="bg-[#2A2A2A] p-3 rounded-lg outline-none"
              value={rgb.b}
              onChange={(e) => handleRgbChange(e, "b")}
            />
          </div>
        </div>
      </div>

      {/* Done btn */}
      <div className="flex justify-end">
        <button
          onClick={handleDone}
          className="bg-white text-black px-6 py-2 rounded-full text-lg font-medium hover:bg-gray-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}

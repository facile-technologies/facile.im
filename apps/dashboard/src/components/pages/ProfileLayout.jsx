import React, { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const isNew = locationState?.isNew === true;
  const incomingProfileLayout = locationState?.profileLayout ?? null;

  const [selectedCard, setSelectedCard] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const handleNext = () => {
    if (selectedCard !== null) {
      navigate("/edit-profile", {
        state: { profileLayout: incomingProfileLayout, isNew },
      });
    }
  };
  return (
    <div className="bg-white dark:bg-[#262626] rounded-[10px] min-h-screen p-10 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Choose Your Profile Layout
        </h2>
        <button
          onClick={() => navigate("/edit-profile", { state: { profileLayout: incomingProfileLayout, isNew } })}
          className="px-6 py-2 rounded-full bg-black! text-white! hover:bg-gray-800 transition"
        >
          Skip
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        Pick a layout that defines how your profile will appear to others. You
        can customize colors, sections, and details later.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mb-10 mt-8">
        {[
          { label: "Simple Tag", image: "/Pet-2.png" },
          { label: "Bold Bark", image: "/Pet-3.png" },
          { label: "Alpha Mode", image: "/Pet-1.png" },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedCard(index)}
            className={`relative w-full max-w-[280px] md:max-w-[350px] h-[330px] md:h-[353px] ${isDarkMode ? "bg-[#3F3F3F]" : "bg-gray-100 shadow-sm border border-gray-200"} rounded-xl cursor-pointer transition
                ${selectedCard === index ? `border-2 ${isDarkMode ? "border-white" : "border-blue-800"}` : ""}
              `}
          >
            {selectedCard === index && (
              <div
                className={`absolute top-0 right-0 ${isDarkMode ? "bg-white" : "bg-accent"} rounded-bl-2xl rounded-tr-xl p-3 text-white shadow-md z-10`}
              >
                <Check size={20} color={isDarkMode ? "#4f7cff" : "white"} />
              </div>
            )}
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover scale-[1.5] pt-15 object-top"
              />
              <div
                className="absolute bottom-0 left-0 w-full h-[90px]
                      bg-linear-to-t from-black/80 to-transparent
                      flex items-end justify-center pb-3"
              >
                <p className="text-white text-[29px] font-semibold">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleNext}
          disabled={selectedCard === null}
          className={`w-64 py-3 rounded-full font-medium transition
            ${
              selectedCard !== null
                ? "bg-black! text-white! hover:bg-gray-800!"
                : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";

export default function SelectProfileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const tabs = ["Network", "RescueID", "Storefront"];

  // profileLayout from incoming state tells us which editor (SOS/Pet/etc.) to use
  const incomingProfileLayout = location.state?.profileLayout ?? null;
  const isNew = location.state?.isNew ?? false;

  const handleNext = () => {
    if (selectedCard !== null) {
      navigate("/edit-profile", {
        state: { profileLayout: incomingProfileLayout, isNew },
      });
    }
  };

  const handleSkip = () => {
    navigate("/edit-profile", {
      state: { profileLayout: incomingProfileLayout, isNew },
    });
  };

  return (
    <div className="w-full h-full rounded-2xl p-4 md:p-10">
      <div className="flex justify-between items-center mb-10">
        <img src="/facile.svg" alt="logo" className="h-7 opacity-90" />
        <a
          onClick={handleSkip} // Skip button leads to the profile edit page
          className="text text-sm hover:text-white underline"
        >
          Skip for now
        </a>
      </div>
      <div className="p-4 md:p-10 flex flex-col gap-10 md:gap-[50px]">
        <div className="text-center mb-8 gap-[27px]">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl md:text-3xl font-bold">
              Choose Your Profile Layout
            </h2>
            <p className="text-xs md:text-sm mt-2">
              Pick a template that defines how your profile will appear to
              others. <br />
              You can customize colors, sections, and details later.
            </p>
          </div>
          <div className="flex justify-center gap-3 mb-8">
            {tabs.map((tab, i) => (
              <a
                type="button"
                key={i}
                onClick={() => {
                  setActiveTab(i);
                  setSelectedCard(i); // Set selected card based on the tab
                }}
                className={`px-5 py-2 rounded-full text-sm transition
                ${
                  activeTab === i
                    ? "bg-accent text-white border-2 border-[#B485FF]"
                    : "bg-[#626262] border-2 text-[#A9A9A9]"
                }
              `}
              >
                {tab}
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mb-10">
          {[
            { label: "Simple Tag", image: "/Pet-2.png" },
            { label: "Bold Bark", image: "/Pet-3.png" },
            { label: "Alpha Mode", image: "/Pet-1.png" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => activeTab !== null && setSelectedCard(index)}
              className={`relative w-full max-w-[280px] md:max-w-[350px] h-[330px] md:h-[353px] bg-[#3F3F3F] rounded-xl cursor-pointer transition
                ${selectedCard === index ? "border-2 border-accent" : null}
                ${activeTab === null ? "opacity-90 cursor-not-allowed" : ""}
              `}
            >
              {selectedCard === index && (
                <div className="absolute top-0 right-0 bg-accent rounded-bl-2xl p-3 text-white shadow-md">
                  <Check size={20} />
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
        <div className="flex justify-center">
          {activeTab !== null && selectedCard !== null && (
            <a
              type="button"
              onClick={handleNext} // Next button updates the URL and shows the selected layout
              className="bg-accent w-50 md:w-60 hover:bg-blue-700 transition text-white text-center px-10 md:px-16 py-3 text-base md:text-lg rounded-full font-semibold"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

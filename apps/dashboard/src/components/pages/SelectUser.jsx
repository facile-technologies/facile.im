import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import PricingPlan from "./PricingPlan";

const devices = [
  { id: "network", title: "Network", img: "/watch-network.png" },
  { id: "rescue", title: "RescueID", img: "/watch-network.png" },
  { id: "storefront", title: "Storefront", img: "/watch-network.png" },
];

const SelectUserType = () => {
  const [selected, setSelected] = useState(null);

  const [showPricing, setShowPricing] = useState(false);

  const navigate = useNavigate();

  const handleSelect = () => navigate("/signup");

  return (
    <>
      {showPricing ? (
        <PricingPlan />
      ) : (
        <div className=" flex flex-col items-center w-full min-h-screen pt-12 px-4 relative">
          <img
            src="/facile.svg"
            alt="logo"
            className="absolute top-8 left-8 w-20 md:top-6 md:left-6 md:w-[110px] opacity-90"
          />
          <a
            type="button"
            onClick={() => setShowPricing(true)}
            className="absolute top-8 right-8 text-xs md:text-sm opacity-70 underline hover:opacity-100"
          >
            Skip for now
          </a>
          <button
            className="back absolute top-[70px] left-4 md:top-[120px] md:left-6 bg-[#ACACAC85] 
             p-2 md:p-2.5 rounded-3xl transition opacity-70 hover:opacity-100"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          <div className="flex flex-col items-center text-center max-w-lg mt-20 px-4">
            <h2 className="text-[28px] md:text-[40px] font-bold mb-2">
              Choose Your Device
            </h2>

            <p
              className="text-[14px] md:text-[18px] opacity-50 
                md:whitespace-nowrap 
                whitespace-normal md:px-0 px-2"
            >
              Find the right package for your needs simple, transparent, and
              built to grow with you.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 justify-center mt-12">
            {devices.map((d) => (
              <div key={d.id} className="flex flex-col items-center">
                <Card
                  onClick={() => setSelected(d.id)}
                  className={`bg-[#222222] w-[330px] h-[360px] rounded-2xl cursor-pointer relative border
          ${selected === d.id ? "border-blue-500" : "border-transparent"}
        `}
                >
                  <CardContent className="h-full flex flex-col items-center justify-center">
                    <img
                      src={d.img}
                      alt={d.title}
                      className="w-[260px] h-[220px] object-contain"
                    />
                  </CardContent>

                  {selected === d.id && (
                    <div
                      className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 cursor-pointer"
                      onClick={handleSelect}
                    >
                      <Check className="text-white w-5 h-5" />
                    </div>
                  )}
                </Card>
                <p className="mt-5 text-[30px] font-medium text-center">
                  {d.title}
                </p>
              </div>
            ))}
          </div>
          {/* <button
            className="getstarted rounded-2xl mt-12 w-[358px] h-[70px] text-[18px] font-semibold"
            onClick={handleSelect}
          >
            Get Started
          </button> */}

          <a
            type="button"
            onClick={() => setShowPricing(true)}
            className="bg-black  dark:bg-[#ffffff]  dark:text-black border-2 rounded-[30px] p-3 mt-4 mb-10 text-white border-[#B485FF] text-sm"
          >
            Already have a device
          </a>
        </div>
      )}
    </>
  );
};

export default SelectUserType;

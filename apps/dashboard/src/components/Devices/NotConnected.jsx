import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";

const sampleDevices = [
  { id: "network", title: "Network", img: "/watch-network.png" },
  { id: "rescue", title: "RescueID", img: "/watch-network.png" },
  { id: "storefront", title: "Storefront", img: "/watch-network.png" },
];

export default function NotConnected() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSelect = () => navigate("/signup");

  return (
    <div className="mt-8">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-[28px] md:text-4xl text-black dark:text-white font-bold mb-2">
          No Devices Linked Yet
        </h2>

        <p className="text-sm md:text-lg text-gray-500 dark:text-[#838383]">
          Your team members don’t have any devices assigned. Link devices to
          profiles to get started.
        </p>
      </div>

      <div className="flex flex-wrap gap-10 justify-center mt-5">
        {sampleDevices.map((d) => (
          <div key={d.id} className="flex flex-col items-center">
            <Card
              onClick={() => setSelected(d.id)}
              className={`bg-gray-50 border-gray-100 dark:bg-[#222222] dark:border-transparent w-[300px] h-[360px] rounded-[22px] cursor-pointer relative border transition-all
                ${selected === d.id ? "border-blue-500 shadow-[0_0_15px_rgba(79, 124, 255,0.4)]" : "border-gray-100 hover:border-gray-200 dark:border-transparent dark:hover:border-white/20"}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect();
                  }}
                >
                  <Check className="text-white w-5 h-5" />
                </div>
              )}
            </Card>
            <p className="mt-4 text-xl font-medium text-center text-black/80 dark:text-white/90">{d.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

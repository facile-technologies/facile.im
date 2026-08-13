"use client";

import { useEffect, useState } from "react";
import PlatformLinks from "./PlatformLinks";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import CustomLinks from "./CustomLinks";
import PlatformLinksAccordion from "../../shared/PlatformLinksAccordion";
import {
  fetchCustomLinks,
  fetchPlatformLinks,
  setLeadCapture,
} from "@/app/stores/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import { useTheme } from "@/context/Themcontext";

export default function LinksSection() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const profileType = useSelector((state) => state.profile.profileType);
  const [activeTab, setActiveTab] = useState("Add Links");
  const dispatch = useDispatch();
  const leadCapture = useSelector((state) => state.profile.leadCapture);

  useEffect(() => {
    if (activeTab === "Add Links") {
      dispatch(fetchCustomLinks({ profileType }));
    }
  }, [activeTab, dispatch]);
  useEffect(() => {
    dispatch(fetchPlatformLinks({ profileType }));
  }, [dispatch]);

  const toggleLeadCapture = (checked) => {
    dispatch(setLeadCapture(checked));
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      <div className={`flex flex-col gap-4 rounded-2xl p-4 w-full max-w-[1100px] transition-colors border ${isDarkMode
        ? "bg-[#303030] border-transparent"
        : "bg-white border-gray-100 shadow-sm"
        }`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className={`rounded-full overflow-hidden w-full h-11 flex items-center ${isDarkMode ? "bg-[#3F3F3F]" : "bg-gray-100"
            }`}>
            <TabsList className="flex w-full rounded-full cursor-pointer h-full border-none p-0 bg-transparent">
              {["Add Links", "Customize Link Style"].map((tab) => (
                <TabsTrigger asChild key={tab} value={tab} className="rounded-full">
                  <a
                    type="button"
                    className={`flex-1 text-center text-sm font-medium rounded-full transition-all flex items-center justify-center h-full ${isDarkMode
                      ? "text-gray-400 data-[state=active]:bg-black data-[state=active]:text-white"
                      : "text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                      }`}
                  >
                    {tab}
                  </a>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="mt-4 w-full">
            {activeTab === "Add Links" ? <PlatformLinks /> : <CustomLinks />}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

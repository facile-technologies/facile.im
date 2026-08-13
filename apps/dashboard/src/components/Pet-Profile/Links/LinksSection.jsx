"use client";

import { useState } from "react";
import PlatformLinks from "./PlatformLinks";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import CustomLinks from "./CustomLinks";
import PlatformLinksAccordion from "../../shared/PlatformLinksAccordion";
import { setLeadCapture } from "@/app/stores/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";

export default function LinksSection() {
  const [activeTab, setActiveTab] = useState("Add Links");
  const dispatch = useDispatch();
  const leadCapture = useSelector((state) => state.profile.leadCapture);

  const toggleLeadCapture = (checked) => {
    dispatch(setLeadCapture(checked));
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      <div className="flex flex-col gap-4 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-6 border border-[#C0C0C017] w-full max-w-[700px]">
        <h2 className="dark:text-white text-black text-[16px] font-bold">
          When Profile Opens
        </h2>

        <div className="w-full mt-2">
          <div className="flex items-center justify-between w-full h-[57px] dark:bg-[#3A3A3A] bg-white rounded-2xl px-4">
            <Label
              htmlFor="lead-capture"
              className="text-black dark:text-white"
            >
              Lead Capture
            </Label>
            <Switch
              id="lead-capture"
              checked={leadCapture}
              onCheckedChange={toggleLeadCapture}
            />
          </div>
        </div>
      </div>
      {/* Links Tab */}
      <div className="flex flex-col gap-4 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 w-full max-w-[1100px] mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full w-full h-11 flex items-center">
            <TabsList className="flex w-full rounded-full">
              {["Add Links", "Customize Link Style"].map((tab) => (
                <TabsTrigger asChild key={tab} value={tab}>
                  <a
                    type="button"
                    className="flex-1 text-center text-sm font-medium text-gray-300 rounded-full transition-all data-[state=active]:h-11 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:rounded-full"
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

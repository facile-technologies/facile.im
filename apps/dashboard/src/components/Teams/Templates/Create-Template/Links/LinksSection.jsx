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

export default function LinksSection() {
  const profileType = useSelector((state) => state.profile.profileType);
  const [activeTab, setActiveTab] = useState("Add Links");
  const dispatch = useDispatch();
  const leadCapture = useSelector((state) => state.profile.leadCapture);

  useEffect(() => {
    if (activeTab === "Add Links") {
      dispatch(fetchCustomLinks({profileType}));
    }
  }, [activeTab, dispatch]);
  useEffect(() => {
    dispatch(fetchPlatformLinks({profileType}));
  }, [dispatch]);

  const toggleLeadCapture = (checked) => {
    dispatch(setLeadCapture(checked));
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1100px] mx-auto">
      <div className="flex flex-col gap-4 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 w-full max-w-[1100px] ">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full w-full h-11 flex items-center">
            <TabsList className="flex w-full rounded-full cursor-pointer">
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

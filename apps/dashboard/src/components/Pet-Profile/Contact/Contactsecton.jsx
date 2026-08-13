import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ContactDetail from "./ContactDetail";
import ContactCustomization from "./ContactCustomization";

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState("Contact Details");
  return (
    <div className="flex flex-col gap-2 w-full mx-auto  rounded-2xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-4"
      >
        <div className="dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full w-full h-11 flex items-center">
          <TabsList className="flex w-full rounded-full cursor-pointer">
            {["Contact Details", "Contact Customization"].map((tab) => (
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
        <div className="mt-2 w-full">
          {activeTab === "Contact Details" ? (
            <ContactDetail />
          ) : (
            <ContactCustomization />
          )}
        </div>
      </Tabs>
    </div>
  );
}

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailContactForm from "./EmailContactForm";
import SaveContactForm from "./SaveContact";
import { useEffect, useState } from "react";
import { fetchContactForm } from "@/app/stores/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ContactSection() {
  const profileType = useSelector((state) => state.profile.profileType);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContactForm({ profileType }));
  }, [dispatch]);
  const [activeTab, setActiveTab] = useState("Email Contact Form");
  return (
    <div className="flex flex-col gap-2 w-full dark:bg-[#303030] p-2 rounded-2xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-4"
      >
        <div className="dark:bg-[#3F3F3F] bg-[#F9FAFB] rounded-full w-full h-11 flex items-center">
          <TabsList className="flex w-full rounded-full cursor-pointer">
            {["Email Contact Form", "Save Contact"].map((tab) => (
              <TabsTrigger asChild key={tab} value={tab}>
                <a
                  type="button"
                  className="flex-1 text-center text-sm font-medium dark:text-gray-300 text-gray-500 rounded-full transition-all data-[state=active]:h-11 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:rounded-full"
                >
                  {tab}
                </a>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="mt-2 w-full">
          {activeTab === "Email Contact Form" ? (
            <EmailContactForm />
          ) : (
            <SaveContactForm />
          )}
        </div>
      </Tabs>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Check, ChevronDown } from "lucide-react";
import { getUserProfiles } from "@/services/user";

import TeamAnalytics from "../Analytics/TeamAnalytics";
import ProfileAnalytics from "../Analytics/ProfileAnalytics";

const DATE_RANGES = [
  { label: "Today", value: "today" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const AnalyticsPage = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("facile");
  const [selectedMember, setSelectedMember] = useState("All Members");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedDate, setSelectedDate] = useState("today");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getUserProfiles()
      .then((res) => {
        const list = res.data?.data || res.data?.profiles || [];
        setProfiles(list);
        if (list.length > 0) setSelectedProfile(list[0]);
      })
      .catch(() => {});
  }, []);

  const selectedDateLabel = DATE_RANGES.find((d) => d.value === selectedDate)?.label || "Today";
  const profileLabel = selectedProfile?.name || "All Profiles";

  return (
    <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
      <div className="flex items-center justify-between gap-1 mb-4">
        <div className="w-full">
          <h2 className="text-2xl font-semibold">Hey, {user?.first_name || "there"}</h2>
          <p className="text-sm text-gray-600 dark:text-[#FFFFFFA3]">
            Placeholder text
          </p>
        </div>
        <div className="flex justify-end items-center gap-3 w-full">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="facile-teams"
            className="max-w-2xs! w-full!"
          >
            <TabsList className="flex w-full! rounded-full bg-[#3F3F3F]!">
              <TabsTrigger
                value="facile"
                className="flex-1 rounded-full text-base! data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]!"
              >
                facile
              </TabsTrigger>
              <TabsTrigger
                value="facile-teams"
                className="flex-1 rounded-full text-base! data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]! border-none!"
              >
                facile Teams
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Profile or Members dropdown */}
          {activeTab === "facile" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-lg bg-[#3F3F3F]! text-white! max-w-[160px]! w-full!" asChild>
                <Button>
                  <span className="truncate max-w-[110px]">{profileLabel}</span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#3F3F3F]! text-white! w-[160px]! border-none!">
                {profiles.map((profile, idx) => {
                  const label = profile.name || `Profile ${idx + 1}`;
                  const isSelected = selectedProfile?.id === profile.id;
                  return (
                    <DropdownMenuItem
                      key={profile.id}
                      className={`${idx < profiles.length - 1 ? "border-b border-[#b4abab2e]" : ""} rounded-none cursor-pointer flex items-center justify-between ${isSelected ? "font-semibold" : ""}`}
                      onSelect={() => setSelectedProfile(profile)}
                    >
                      <span className="truncate">{label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
                {profiles.length === 0 && (
                  <DropdownMenuItem disabled className="text-white/50">No profiles</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-lg bg-[#3F3F3F]! text-white! max-w-[142px]! w-full!" asChild>
                <Button>
                  {selectedMember}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#3F3F3F]! text-white! w-[142px]! border-none!">
                {["All Members", "Member 1", "Member 2"].map((member, idx, arr) => (
                  <DropdownMenuItem
                    key={member}
                    className={`${idx < arr.length - 1 ? "border-b border-[#b4abab2e]" : ""} rounded-none cursor-pointer flex items-center justify-between ${selectedMember === member ? "font-semibold" : ""}`}
                    onSelect={() => setSelectedMember(member)}
                  >
                    <span>{member}</span>
                    {selectedMember === member && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Date range dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg bg-[#3F3F3F]! text-white! max-w-[120px]! w-full!" asChild>
              <Button>
                {selectedDateLabel}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#3F3F3F]! text-white! w-[120px]! border-none!">
              {DATE_RANGES.map((range, idx) => (
                <DropdownMenuItem
                  key={range.value}
                  className={`${idx < DATE_RANGES.length - 1 ? "border-b border-[#b4abab2e]" : ""} rounded-none cursor-pointer flex items-center justify-between ${selectedDate === range.value ? "font-semibold" : ""}`}
                  onSelect={() => setSelectedDate(range.value)}
                >
                  <span>{range.label}</span>
                  {selectedDate === range.value && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {activeTab === "facile" ? (
        <ProfileAnalytics selectedProfile={selectedProfile} dateRange={selectedDate} />
      ) : (
        <TeamAnalytics selectedMember={selectedMember} dateRange={selectedDate} />
      )}
    </div>
  );
};

export default AnalyticsPage;

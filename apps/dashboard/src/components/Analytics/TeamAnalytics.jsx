import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import {
  Check,
  ChevronDown,
  Download,
  Globe,
  MousePointerClick,
  Users,
} from "lucide-react";

import { StatCard } from "../Teams-Analytics/StatCard";
import ViewsChart from "../Teams-Analytics/ViewsChart";
import { RecentActivity } from "../Teams-Analytics/RecentActivity";
import { ViewType } from "../Teams-Analytics/ViewType";
import { ContactsCard } from "../Teams-Analytics/ContactsCard";
import { TopTappedLinks } from "../Teams-Analytics/TopTappedLinks";
import { MostActiveDevices } from "../Teams-Analytics/MostActiveDevices";
import ProfileAnalytics from "./ProfileAnalytics";

const TeamAnalytics = () => {
  const sampleData = [
    { value: 10 },
    { value: 25 },
    { value: 15 },
    { value: 35 },
    { value: 22 },
    { value: 40 },
    { value: 30 },
    { value: 20 },
    { value: 28 },
    { value: 45 },
    { value: 50 },
    { value: 35 },
    { value: 42 },
    { value: 60 },
    { value: 55 },
    { value: 30 },
    { value: 48 },
    { value: 58 },
  ];

  return (
    <div>
      <div className="grid gap-4  md:grid-cols-2 xl:grid-cols-4 mb-3 ">
        <StatCard
          title="Contacts"
          value={97}
          percentage="+125%"
          icon={Users}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#b7f28e"
          gradientId="contactsGradient"
          data={sampleData}
        />

        <StatCard
          title="Profile Views"
          value={97}
          percentage="+125%"
          icon={MousePointerClick}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#86efac"
          gradientId="viewsGradient"
          data={sampleData}
        />

        <StatCard
          title="Total Interactions"
          value={97}
          percentage="+125%"
          icon={Globe}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#eab308"
          gradientId="interactionGradient"
          data={sampleData}
        />

        <StatCard
          title="Contacts Download"
          value={97}
          percentage="+125%"
          icon={Download}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#fca5a5"
          gradientId="downloadGradient"
          data={sampleData}
        />
      </div>
      <div className="flex justify-between gap-5">
        <div className="w-full">
          <ViewsChart />
          <ContactsCard />
          <MostActiveDevices />
        </div>
        <div className="max-w-[371px] w-full">
          <RecentActivity />
          <ViewType />
          <TopTappedLinks />
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;

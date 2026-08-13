import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import snapchat from "@/assets/svgs/snapchat.svg";
import email from "@/assets/svgs/email.svg";
import website from "@/assets/svgs/website.svg";
import call from "@/assets/svgs/call.svg";
import facetime from "@/assets/svgs/facetime.svg";

export const TopTappedLinks = () => {
  const links = [
    {
      id: 1,
      title: "SnapChat",
      subtitle: "Gohar",
      icon: snapchat,
      count: 0,
    },
    {
      id: 2,
      title: "Email",
      subtitle: "Gohar",
      icon: email,
      count: 0,
    },
    {
      id: 3,
      title: "Website",
      subtitle: "Gohar",
      icon: website,
      count: 0,
    },
    {
      id: 4,
      title: "Personal Call",
      subtitle: "Gohar",
      icon: call,
      count: 0,
    },
    {
      id: 5,
      title: "Facetime",
      subtitle: "Gohar",
      icon: facetime,
      count: 0,
    },
  ];

  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl  p-6! mt-3 ">
      <CardContent className="p-0!">
        <div className="flex items-center justify-between ">
          <h3 className=" font-medium text-white">Top Tapped Links</h3>

          {/* <Button className="bg-transparent! flex items-center gap-1! text-sm text-white! p-0!  ">
            View more
            <ChevronRight className="h-4 w-4" />
          </Button> */}
        </div>

        <div className="space-y-4 mt-4">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={link.icon} alt={link.title} />

                <div>
                  <p className="font-bold text-white">{link.title}</p>
                  <p className="text-sm text-white">{link.subtitle}</p>
                </div>
              </div>

              <span className=" text-white">{link.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

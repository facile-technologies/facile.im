import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export const ContactsCard = () => {
  const contacts = [
    {
      id: 1,
      name: "Person 1",
      message: "shared his information with you",
      email: "person1@gmail.com",
      profileImage: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
      id: 2,
      name: "Person 2",
      message: "shared his information with you",
      email: "person2@gmail.com",
      profileImage: "https://randomuser.me/api/portraits/men/19.jpg",
    },
    {
      id: 3,
      name: "Person 3",
      message: "shared his information with you",
      email: "person3@gmail.com",
      profileImage: "https://randomuser.me/api/portraits/men/98.jpg",
    },
    {
      id: 4,
      name: "Person 4",
      message: "shared his information with you",
      email: "person4@gmail.com",
      profileImage: "https://randomuser.me/api/portraits/men/34.jpg",
    },
  ];

  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl  p-6! mt-3">
      <CardContent className="p-0!">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <h3 className=" font-medium text-white">Contacts</h3>

          <Button className="bg-transparent! flex items-center gap-1! text-sm text-white! p-0!  ">
            View more
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-3">
              <img
                src={contact.profileImage}
                alt={contact.name}
                className="h-12 w-12 rounded-full object-cover border border-black"
              />
              <div className="space-y-1">
                <p className="text-white text-sm">
                  <span className="font-bold text-white">{contact.name}</span>{" "}
                  {contact.message}
                </p>
                <p className="text-sm text-white">{contact.email}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

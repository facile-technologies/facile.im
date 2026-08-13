import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      name: "Person 1",
      message: "Website was tapped",
      profileImage: "https://randomuser.me/api/portraits/men/21.jpg",
    },
    {
      id: 2,
      name: "Person 2",
      message: "Text was tapped",
      profileImage: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
      id: 3,
      name: "Person 3",
      message: "Connected with Gohar",
      profileImage: "https://randomuser.me/api/portraits/men/73.jpg",
    },
  ];

  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl  p-6!   ">
      <CardHeader className={"px-0! gap-0!"}>
        <CardTitle className="text-lg font-medium ">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 px-0!">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <img
              src={activity.profileImage}
              alt={activity.name}
              className="h-12 w-12 rounded-full object-cover"
            />

            <p className="text-white text-sm">
              <span className="font-bold text-white">{activity.name}</span>{" "}
              {activity.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

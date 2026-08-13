import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const MostActiveDevices = () => {
  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl  p-6! mt-3 h-[192px] ">
      <CardContent className="p-0! h-full flex flex-col">
        <h3 className=" font-medium ">Activated Device</h3>

        <div className="flex flex-1 items-center justify-center mt-6">
          <p className=" text-[#F6F6F6]">No data available</p>
        </div>
      </CardContent>
    </Card>
  );
};

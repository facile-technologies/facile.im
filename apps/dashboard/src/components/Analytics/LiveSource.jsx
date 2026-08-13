import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import source from "@/assets/svgs/source.svg";

export const LiveSource = ({ sources = [], loading = false }) => {
  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl p-6! mt-3 w-full!">
      <CardContent className="p-0!">
        <div className="flex items-center gap-3">
          <img src={source} alt="Source Icon" />
          <h3 className="font-semibold text-white">Live Source</h3>
        </div>

        <div className="space-y-4 mt-6">
          {loading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : sources.length === 0 ? (
            <p className="text-white/40 text-sm">No data</p>
          ) : (
            sources.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <p className="font-bold text-white capitalize">{item.source}</p>
                <span className="text-white">{item.total_views}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

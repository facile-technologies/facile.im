import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const TopTappedLinks = ({ links = [], loading = false }) => {
  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl p-6! w-full!">
      <CardContent className="p-0!">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Top Tapped Links</h3>
        </div>

        <div className="space-y-4 mt-6">
          {loading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-white/40 text-sm">No data</p>
          ) : (
            links.map((link) => {
              const title = link.profileLink?.title || link.profileLink?.username || "Link";
              const url = link.profileLink?.url || "";
              const count = link.total_clicks || 0;
              return (
                <div key={link.profile_link_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="text-xs text-white/50 truncate max-w-[140px]">{url}</p>
                  </div>
                  <span className="text-white">{count}</span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"

export default function PeriodComparison({ periodData, loading = false }) {
  // Build bar chart data from period comparison
  const currentData = periodData?.current?.data || [];
  const previousData = periodData?.previous?.data || [];

  const currentViews = currentData.reduce((s, d) => s + (d.views_count || 0), 0);
  const currentClicks = currentData.reduce((s, d) => s + (d.clicks_count || 0), 0);
  const previousViews = previousData.reduce((s, d) => s + (d.views_count || 0), 0);
  const previousClicks = previousData.reduce((s, d) => s + (d.clicks_count || 0), 0);

  const data = [
    { name: "Profile Views", current: currentViews, previous: previousViews },
    { name: "Link Clicks", current: currentClicks, previous: previousClicks },
    { name: "Total Activity", current: currentViews + currentClicks, previous: previousViews + previousClicks },
  ];
  return (
    <Card className="bg-[#363636] border-none rounded-2xl text-white w-full! p-6!">
      <CardContent className="p-0! ">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className=" font-semibold text-white">Period Comparison</h2>

          {/* Legend (top right) */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              Current Period
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              Previous Period
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={20}>
              
              <XAxis
                dataKey="name"
                stroke="#888"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#888"
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              {/* Previous (Pink) */}
              <Bar
                dataKey="previous"
                fill="#EC4899"
                radius={[6, 6, 0, 0]}
                barSize={30}
              />

              {/* Current (Purple/Blue) */}
              <Bar
                dataKey="current"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  )
}
"use client"

import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const COLORS = ["#A855F7", "#2563EB"] // purple, blue

export default function ActivityDistribution({ distribution, loading = false }) {
  const data = [
    { name: "Profile Views", value: parseFloat(distribution?.profile_views?.percentage || 50) },
    { name: "Link Clicks", value: parseFloat(distribution?.link_clicks?.percentage || 50) },
  ];
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="bg-[#363636] border-none rounded-2xl text-white w-full! p-6!">
      <CardContent className="p-0!">

        {/* Title */}
        <h2 className=" font-semibold text-white mb-6">
          Activity Distribution
        </h2>

        {/* Pie Chart */}
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={0} // full pie (not donut)
                outerRadius={110}
                paddingAngle={1}
                dataKey="value"
                stroke="#3A3A3A"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + Percent */}
        <div className="mt-4 space-y-3">
          {data.map((item, index) => {
            const percent = total
              ? ((item.value / total) * 100).toFixed(0)
              : 0

            return (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  {item.name}
                </div>

                <span className="text-gray-400">
                  {percent}%
                </span>
              </div>
            )
          })}
        </div>

      </CardContent>
    </Card>
  )
}
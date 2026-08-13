"use client"

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const StatCard = ({ title, value }) => (
  <div className="flex items-center justify-between bg-[#2F2F2F] border border-[#3A3A3A] rounded-xl px-4 py-3 w-full">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#3A3A3A] flex items-center justify-center">
        <TrendingUp className="w-4 h-4 text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-white font-semibold text-lg">{value}</p>
      </div>
    </div>
    <span className="text-xs text-blue-400 flex items-center gap-1">Live</span>
  </div>
)

export default function RealTimeActivity({ liveData, loading = false }) {
  const totals = liveData?.totals || {};
  const totalViews = totals.total_views ?? 0;
  const totalClicks = totals.total_clicks ?? 0;
  const totalActivity = totalViews + totalClicks;

  const chartData = (liveData?.hourly || [])
    .filter((row) => row.views > 0 || row.clicks > 0)
    .map((row) => ({
      time: row.hour,
      visits: row.views,
      clicks: row.clicks,
    }));

  return (
    <Card className="bg-[#363636] border-none rounded-2xl text-white p-6!">
      <CardContent className="p-0!">

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Real-Time Activity</h2>
          <Badge className="bg-[#3A2A5A] text-blue-300 rounded-full px-3 py-1">
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Views" value={loading ? "—" : totalViews} />
          <StatCard title="Total Clicks" value={loading ? "—" : totalClicks} />
          <StatCard title="Total Activity" value={loading ? "—" : totalActivity} />
        </div>

        <div className="h-[300px] w-full">
          {loading ? (
            <p className="text-white/40 text-sm mt-4">Loading...</p>
          ) : chartData.length === 0 ? (
            <p className="text-white/40 text-sm mt-4">No activity yet today</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 11 }} />
                <YAxis stroke="#888" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="visits" name="Views" stroke="#6366F1" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#EC4899" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <div className="bg-[#2F2F2F] rounded-xl px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              Profile Views
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              Link Clicks
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

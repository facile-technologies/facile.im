"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  percentage,
  icon: Icon,
  iconBg,
  iconColor,
  strokeColor,
  gradientId,
  data,
}) {
  return (
    <Card className="relative overflow-hidden rounded-xl border-0 bg-[#363636] px-4 pt-5 pb-3 text-white shadow-xl gap-0! max-h-[194px]!">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <span className=" text-sm  ">{title}</span>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium text-accent">
          {percentage}
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>

      {/* Value */}
      <div className="mt-4 text-3xl font-semibold">{value}</div>

      {/* Chart */}
      <div className=" h-20 ">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.7} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

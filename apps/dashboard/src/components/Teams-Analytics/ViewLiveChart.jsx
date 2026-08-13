import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const TAB_CONFIG = {
  orders:      { label: "Orders",      color: "#ec4899" },
  conversions: { label: "Conversions", color: "#8B5CF6" },
  earnings:    { label: "Earnings",    color: "#A8D854" },
};

function toChartData(series = []) {
  return series.map((pt) => ({
    time: new Date(pt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Number(pt.value),
  }));
}

const ViewLiveChart = ({ realTimeActivity = {} }) => {
  const [activeTab, setActiveTab] = useState("orders");

  const availableTabs = Object.keys(TAB_CONFIG).filter(
    (key) => Array.isArray(realTimeActivity[key]) && realTimeActivity[key].length > 0
  );

  const chartData = toChartData(realTimeActivity[activeTab] || []);
  const { color } = TAB_CONFIG[activeTab] || TAB_CONFIG.orders;

  return (
    <Card className="rounded-xl border-0 bg-[#FFFFFF] dark:bg-[#3F3F3F] p-6 text-white h-full w-full shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-black dark:text-white">Real-Time Activity</h2>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-[320px] w-full"
        >
          <TabsList className="bg-[#3F3F3F]! rounded-full p-0 h-11 w-full flex border border-[#ffffff10] shadow-inner overflow-hidden">
            {availableTabs.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex-1 rounded-full px-4 text-xs font-semibold h-full transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-gray-500! dark:text-white! border-none! shadow-none!"
              >
                {TAB_CONFIG[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#ffffff05" vertical={false} horizontal={false} />

            <XAxis
              dataKey="time"
              stroke="#8B5CF6"
              tick={{ fill: "#FFFFFF66", fontSize: 10 }}
              axisLine={{ stroke: "#8B5CF6", strokeWidth: 1 }}
              tickLine={{ stroke: "#8B5CF6" }}
              dy={10}
            />

            <YAxis
              stroke="#8B5CF6"
              tick={{ fill: "#FFFFFF66", fontSize: 10 }}
              axisLine={{ stroke: "#8B5CF6", strokeWidth: 1 }}
              tickLine={{ stroke: "#8B5CF6" }}
              dx={-5}
            />

            <Tooltip
              contentStyle={{ backgroundColor: "#262626", border: "none", borderRadius: "8px", color: "#fff" }}
              itemStyle={{ color }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ViewLiveChart;
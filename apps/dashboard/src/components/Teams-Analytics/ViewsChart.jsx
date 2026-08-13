import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Label } from "recharts"; 

import { Card } from "@/components/ui/card";

const data = [
  { date: "Jan 1", views: 600 },
  { date: "Jan 2", views: 620 },
  { date: "Jan 3", views: 950 },
  { date: "Jan 4", views: 650 },
  { date: "Jan 5", views: 250 },
  { date: "Jan 6", views: 800 },
  { date: "Jan 7", views: 700 },
  { date: "Jan 8", views: 820 },
];

export default function ViewsChart() {
  return (
    <Card className="rounded-xl border-0 bg-[#363636] p-6 text-white max-h-[332px]! h-full! w-full!">
      <h2 className=" font-medium  text-white">Views Over Time</h2>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid stroke="#424242" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#d4d4d4 "
              tick={{ fill: "#d4d4d4 ", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            >
              <Label
                value="Time"
                offset={-10}
                position="insideBottom"
                fill="#d4d4d4 "
                fontSize={14}
              />
            </XAxis>

            <YAxis
              stroke="#d4d4d4 "
              tick={{ fill: "#d4d4d4 ", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 1000]}
              ticks={[0, 200, 400, 600, 800, 1000]}
              width={40}
            >
              <Label
                value="Views"
                angle={-90}
                position="insideLeft"
                fill="#d4d4d4 "
                offset={-10}
                fontSize={14}
              />
            </YAxis>

            <Line
              type="monotone"
              dataKey="views"
              stroke="#a855f7"
              strokeWidth={3}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

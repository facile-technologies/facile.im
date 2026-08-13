import React from 'react';
import { Card } from "@/components/ui/card";

const PALETTE = ['#f87171', '#D4A896', '#D4C896', '#A8D854', '#60A5FA', '#8B5CF6', '#FBBF24', '#34D399'];
const RADII   = [90, 73, 56, 39, 24];

const COUNTRY_NAMES = {
  US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', IN: 'India', PK: 'Pakistan', CN: 'China',
  BR: 'Brazil', MX: 'Mexico', AE: 'UAE', SA: 'Saudi Arabia', NG: 'Nigeria',
};

function buildSegments(geographic = []) {
  const sorted = [...geographic]
    .sort((a, b) => b.orders - a.orders)
    .slice(0, RADII.length);
  const maxOrders = sorted[0]?.orders || 1;
  return sorted.map((g, i) => ({
    name: COUNTRY_NAMES[g.country] || g.country,
    value: g.orders / maxOrders,
    color: PALETTE[i % PALETTE.length],
    radius: RADII[i],
    orders: g.orders,
  }));
}

// All arcs share the SAME end angle (bottom-right ~150°)
// and differ in start angle based on their value.
// SVG angles: 0° = 3 o'clock, going clockwise.
// End angle fixed at 150° (5 o'clock area, matching the image)
// Start angle = endAngle - (value * 300°) — 300° is the max sweep

const END_ANGLE_DEG = 150;   // fixed end point for all arcs
const MAX_SWEEP_DEG = 300;   // maximum arc sweep (full-ish circle)

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  // Normalize sweep
  let sweep = endDeg - startDeg;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;

  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const GeographicsChart = ({ geographic = [] }) => {
  const cx = 110, cy = 110;
  const segments = buildSegments(geographic);
  const totalOrders = geographic.reduce((s, g) => s + g.orders, 0);

  return (
    <Card className="rounded-xl border-0 bg-[#FFFFFF]! dark:bg-[#3F3F3F]! p-5 text-white h-full w-full shadow-lg flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Geographic Analytics
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Chart */}
        <div className="relative" style={{ width: 220, height: 220 }}>
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            overflow="visible"
          >
            {/* Colored arcs — all end at END_ANGLE_DEG */}
            {segments.map((seg) => {
              const sweepDeg = seg.value * MAX_SWEEP_DEG;
              const startDeg = END_ANGLE_DEG - sweepDeg;

              return (
                <path
                  key={seg.name}
                  d={describeArc(cx, cy, seg.radius, startDeg, END_ANGLE_DEG)}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Dots at BOTH ends of each arc */}
            {segments.map((seg) => {
              const sweepDeg = seg.value * MAX_SWEEP_DEG;
              const startDeg = END_ANGLE_DEG - sweepDeg;
              const startPt = polarToCartesian(cx, cy, seg.radius, startDeg);
              const endPt = polarToCartesian(cx, cy, seg.radius, END_ANGLE_DEG);
              return (
                <g key={`dots-${seg.name}`}>
                  <circle cx={startPt.x} cy={startPt.y} r={4.5} fill={seg.color} />
                  <circle cx={endPt.x} cy={endPt.y} r={4.5} fill={seg.color} />
                </g>
              );
            })}
          </svg>

          {/* Center label */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ top: -6 }}
          >
            <span className="text-4xl font-bold text-black dark:text-white leading-none">
              {totalOrders}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-400 mt-1 tracking-wide">
              orders
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-6 w-full max-w-[260px]">
          {segments.map((seg) => (
            <div key={seg.name} className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {seg.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default GeographicsChart;
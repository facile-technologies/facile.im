import React from 'react';
import { Card } from "@/components/ui/card";

const COLORS = ['#f87171', '#D4A896', '#D4C896', '#A8D854', '#818cf8', '#34d399'];
const RADII = [90, 73, 56, 39, 28, 20];
const END_ANGLE_DEG = 150;
const MAX_SWEEP_DEG = 300;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  let sweep = endDeg - startDeg;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const GeographicalAnalytics = ({ countries = [], loading = false }) => {
  const cx = 110, cy = 110;

  // Take top 6 countries, normalize values to 0-1 based on max
  const top = countries.slice(0, 6);
  const maxViews = top.reduce((m, c) => Math.max(m, c.total_views_count || 0), 1);
  const totalViews = top.reduce((s, c) => s + (c.total_views_count || 0), 0);

  const segments = top.map((c, i) => ({
    name: c.country_name || c.country_code,
    value: (c.total_views_count || 0) / maxViews,
    color: COLORS[i % COLORS.length],
    radius: RADII[i] || 20,
  }));

  return (
    <Card className="flex flex-col rounded-xl border-0 bg-[#FFFFFF]! dark:bg-[#363636]! p-6! text-white w-full! shadow-lg">
      <h2 className="font-semibold mb-4 text-black dark:text-white">
        Geographic Analytics
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <p className="text-white/40 text-sm">Loading...</p>
        ) : segments.length === 0 ? (
          <p className="text-white/40 text-sm">No geographic data</p>
        ) : (
          <>
            <div className="relative" style={{ width: 220, height: 220 }}>
              <svg width="220" height="220" viewBox="0 0 220 220" overflow="visible">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: -6 }}>
                <span className="text-4xl font-bold text-black dark:text-white leading-none">{totalViews}</span>
                <span className="text-xs text-gray-400 mt-1 tracking-wide">views</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-6 w-full max-w-[260px]">
              {segments.map((seg) => (
                <div key={seg.name} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{seg.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default GeographicalAnalytics;
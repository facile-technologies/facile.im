import React, { useEffect, useState } from "react";
import { Download, Globe, MousePointerClick, Users } from "lucide-react";

import RealTimeActivity from "../Analytics/RealTimeActivity";
import { LiveSource } from "../Analytics/LiveSource";
import { TrafficSource } from "../Analytics/TrafficSource";
import PeriodComparison from "../Analytics/PeriodComparison";
import ActivityDistribution from "../Analytics/ActivityDistribution";
import GeographicalAnalytics from "../Analytics/GeographicalAnalytics";
import { TopTappedLinks } from "../Analytics/TopTappedLinks";
import { ContactsCard } from "../Analytics/ContactsCard";
import { StatCard } from "../Analytics/StatCard";
import { getUserAnalytics, getLiveUserAnalytics } from "@/services/user";

const POLL_INTERVAL_MS = 60_000; // 1 minute

const ProfileAnalytics = ({ selectedProfile, dateRange = "today" }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [liveData, setLiveData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);

  // Fetch main analytics when profile or date range changes
  useEffect(() => {
    if (!selectedProfile?.id) return;
    setLoading(true);
    getUserAnalytics(selectedProfile.id, dateRange)
      .then((res) => setAnalyticsData(res.data))
      .catch(() => setAnalyticsData(null))
      .finally(() => setLoading(false));
  }, [selectedProfile?.id, dateRange]);

  // Poll live analytics every 60 seconds
  useEffect(() => {
    if (!selectedProfile?.id) return;

    const fetchLive = () => {
      setLiveLoading(true);
      getLiveUserAnalytics(selectedProfile.id)
        .then((res) => setLiveData(res.data))
        .catch(() => {})
        .finally(() => setLiveLoading(false));
    };

    fetchLive(); // immediate first call
    const timer = setInterval(fetchLive, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [selectedProfile?.id]);

  const stats = analyticsData?.stats || {};
  // Build sparkline data from period_comparison current data
  const sparkline = (analyticsData?.period_comparison?.current?.data || []).map((d) => ({
    value: d.views_count || 0,
  }));
  const sparklineClicks = (analyticsData?.period_comparison?.current?.data || []).map((d) => ({
    value: d.clicks_count || 0,
  }));

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-3">
        <StatCard
          title="Profile Views"
          value={loading ? "—" : stats.total_views ?? 0}
          icon={MousePointerClick}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#86efac"
          gradientId="viewsGradient"
          data={sparkline.length ? sparkline : [{ value: 0 }]}
        />
        <StatCard
          title="Link Clicks"
          value={loading ? "—" : stats.total_clicks ?? 0}
          icon={Users}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#b7f28e"
          gradientId="clicksGradient"
          data={sparklineClicks.length ? sparklineClicks : [{ value: 0 }]}
        />
        <StatCard
          title="Total Interactions"
          value={loading ? "—" : stats.total_interactions ?? 0}
          icon={Globe}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#eab308"
          gradientId="interactionGradient"
          data={sparkline.length ? sparkline : [{ value: 0 }]}
        />
        <StatCard
          title="Engagement Rate"
          value={loading ? "—" : `${stats.engagement_rate ?? 0}%`}
          icon={Download}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          strokeColor="#fca5a5"
          gradientId="engagementGradient"
          data={sparkline.length ? sparkline : [{ value: 0 }]}
        />
      </div>

      <RealTimeActivity liveData={liveData} loading={liveLoading} />

      <div className="flex justify-between gap-5 mb-3">
        <TrafficSource sources={analyticsData?.traffic_sources || []} loading={loading} />
        <LiveSource sources={liveData?.live_sources || []} loading={liveLoading} />
      </div>

      <div className="flex justify-between gap-5 mb-3">
        <PeriodComparison periodData={analyticsData?.period_comparison} loading={loading} />
        <ActivityDistribution distribution={analyticsData?.activity_distribution} loading={loading} />
      </div>

      <div className="flex justify-between gap-5">
        <TopTappedLinks links={analyticsData?.platform_links || []} loading={loading} />
        <ContactsCard contacts={analyticsData?.contacts_submission || []} loading={loading} />
        <GeographicalAnalytics countries={analyticsData?.countries || []} loading={loading} />
      </div>
    </div>
  );
};

export default ProfileAnalytics;

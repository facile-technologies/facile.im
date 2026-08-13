import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Cpu,
  Layers,
  Users,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useGetDashboardStatsQuery } from '../../store/api/dashboardApi';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon size={22} className="text-white" />
      </div>
      {trend === 'up' ? (
        <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
          +{trendValue}% <TrendingUp size={14} />
        </span>
      ) : (
        <span className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
          -{trendValue}% <TrendingDown size={14} />
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [range, setRange] = useState('6months');
  const { data: response, isLoading, isError, refetch } = useGetDashboardStatsQuery(range);
  const dashboardData = response?.data;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard intelligence...</p>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-2">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Failed to load dashboard</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs px-2 mx-auto">
            {isError ? "We couldn't retrieve the latest statistics. Please check your connection." : "Dashboard data format is incorrect or currently unavailable."}
          </p>
        </div>
        <button
          onClick={refetch}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const {
    stats = {},
    growth_metrics = [],
    profile_distribution = [],
    recent_transactions = []
  } = dashboardData || {};

  return (
    <div className="space-y-6 pb-8">

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Facille Dashboard Stats</h2>

        </div>
        {/* <div className="flex gap-3">
          <button className="bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            Generate Report
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
            + Provision Devices
          </button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Customers"
          value={stats?.total_customers?.value?.toLocaleString()}
          trend={stats?.total_customers?.trend}
          trendValue={stats?.total_customers?.trend_value}
          icon={Users}
          colorClass="bg-gradient-to-br from-blue-500 to-indigo-400"
        />
        <StatCard
          title="Total NFC Chips"
          value={stats?.total_nfc_chips?.value?.toLocaleString()}
          trend={stats?.total_nfc_chips?.trend}
          trendValue={stats?.total_nfc_chips?.trend_value}
          icon={Cpu}
          colorClass="bg-gradient-to-br from-purple-500 to-pink-400"
        />
        <StatCard
          title="Chips Mapped"
          value={stats?.chips_mapped?.value?.toLocaleString()}
          trend={stats?.chips_mapped?.trend}
          trendValue={stats?.chips_mapped?.trend_value}
          icon={Layers}
          colorClass="bg-gradient-to-br from-emerald-500 to-teal-400"
        />
        <StatCard
          title="Inactive Chips"
          value={stats?.inactive_chips?.value?.toLocaleString()}
          trend={stats?.inactive_chips?.trend}
          trendValue={stats?.inactive_chips?.trend_value}
          icon={ShieldCheck}
          colorClass="bg-gradient-to-br from-orange-500 to-amber-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Growth Chart - Main */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Growth Metrics</h3>
              <p className="text-sm text-gray-500">User signups vs Device activations</p>
            </div>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-none rounded-lg text-sm p-2 outline-none cursor-pointer text-gray-700 dark:text-gray-300 font-medium"
            >
              <option value="month">This Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth_metrics}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  dy={10}
                  tickFormatter={(val) => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    // If it's 6months or year view and the value is a numeric string (01-12)
                    if ((range === '6months' || range === 'year') && !isNaN(val)) {
                      const monthIdx = parseInt(val) - 1;
                      return months[monthIdx] || val;
                    }

                    if (range === 'month' && !isNaN(val)) {
                      const currentMonth = months[new Date().getMonth()];
                      return `${currentMonth} ${parseInt(val)}`;
                    }

                    return val;
                  }}
                  interval={range === 'month' ? 4 : 0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  labelFormatter={(label) => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    if ((range === '6months' || range === 'year') && !isNaN(label)) {
                      const monthIdx = parseInt(label) - 1;
                      return months[monthIdx] || label;
                    }

                    if (range === 'month' && !isNaN(label)) {
                      const currentMonth = months[new Date().getMonth()];
                      return `${currentMonth} ${parseInt(label)}`;
                    }
                    return label;
                  }}
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="devices"
                  stroke="#ec4899"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDevices)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profile Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Profile Distribution</h3>
          <p className="text-sm text-gray-500 mb-6">User profiles categorized by type</p>

          <div className="space-y-5">
            {profile_distribution?.map((profile, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{profile.name}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{profile.value} profiles</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(profile.value / Math.max(...profile_distribution.map(p => p.value))) * 100}%`,
                      backgroundColor: profile.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <button className="w-full py-2.5 text-primary font-bold text-sm hover:bg-primary/5 rounded-xl transition-colors">
              Deep Analytics Profile
            </button>
          </div> */}
        </div>
      </div>

      {/* Recent Subscriptions / Customers */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Transactions</h3>
            <p className="text-sm text-gray-500">Latest subscription plan activations</p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark">
            View All Activity <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {recent_transactions?.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-white flex items-center justify-center text-[10px] font-black italic shadow-sm">
                        {item.user_name?.substring(0, 2).toUpperCase() || 'FC'}
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{item.user_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>{item.subscription_plan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white">
                    ${parseFloat(item.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${item.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

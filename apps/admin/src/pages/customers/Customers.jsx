import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  User,
  Settings,
  Mail,
  UserCircle,
  Phone,
  Layout,
  Briefcase,
  PawPrint,
  ShieldAlert,
  Store,
  Cpu,
  Layers,
  Edit2,
  Eye,
  Smartphone,
  Calendar,
  Hash
} from 'lucide-react';
import { useGetUsersQuery } from '../../store/api/userApi';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

const Customers = () => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = 20;

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Combine filters into one search param
  const cleanSearch = debouncedSearch?.startsWith('@') ? debouncedSearch.slice(1) : debouncedSearch;
  const combinedSearch = cleanSearch || undefined;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [combinedSearch]);

  const { data: apiResponse, isLoading, error, refetch, isFetching } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: combinedSearch || undefined,
  });

  const users = apiResponse?.data?.list || [];
  const pagination = apiResponse?.data?.pagination;
  const totalPages = pagination?.total_pages || 1;

  // Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCircle className="text-primary" />
              Customers
            </h2>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {pagination?.total?.toLocaleString() || '0'} TOTAL
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your customer base and view their activity.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center"
          title="Refresh"
        >
          <RotateCcw className={cn("w-5 h-5", isFetching && "animate-spin")} />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">

        {/* Toolbar / Filters */}
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-500 hover:text-primary text-sm font-medium transition-colors"
            >
              Reset Search
            </button>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <div className="text-center">
              <p className="text-gray-900 dark:text-white font-bold">Failed to load data</p>
              <p className="text-gray-500 text-sm mt-1">{error?.data?.message || 'Check your connection and try again.'}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="mt-2 text-primary font-bold text-sm hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <tr>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Username</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4 text-center whitespace-nowrap">Profiles Count</th>
                    <th className="px-4 py-4 text-center whitespace-nowrap">Mapped Chips</th>
                    <th className="px-4 py-4">Plan</th>
                    <th className="px-4 py-4 text-right whitespace-nowrap">Joined</th>
                    <th className="px-4 py-4 text-right whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-400 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-zinc-900 shrink-0 overflow-hidden">
                            {user.profile_image ? (
                              <img src={user.profile_image} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{user.full_name?.[0] || 'U'}</span>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-xs line-clamp-1">{user.full_name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                        @{user.username}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {user.email}
                      </td>


                      <td className="px-4 py-4 text-center">
                        <button

                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-all group shadow-sm"
                        >
                          <Layers size={14} className="text-gray-400 group-hover:text-primary" />
                          <span>{
                            (user.personal_profile_count || 0) +
                            (user.business_profile_count || 0) +
                            (user.pet_profile_count || 0) +
                            (user.sos_profile_count || 0) +
                            (user.store_front_profile_count || 0)
                          } Profiles</span>
                        </button>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-[10px] font-black text-gray-700 dark:text-gray-300">
                          <Cpu size={12} className="text-primary" />
                          {user.mapped_device_count}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {user.plan ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-primary whitespace-nowrap">{user.plan.title}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-medium">{user.plan.duration}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[10px] font-medium uppercase">Free</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-4 text-right text-xs text-gray-500 white space-nowrap">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Active</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedCustomer(user);
                            setIsDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
                        >
                          <Eye size={12} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {(pagination.total_pages > 1 || users.length === itemsPerPage || currentPage > 1) && (
              <div className="p-5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages || users.length < itemsPerPage || isFetching}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Customer Full Detail Modal */}
      {isDetailModalOpen && selectedCustomer && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsDetailModalOpen(false)}
          />
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header - Profile Dossier Style */}
            <div className="relative p-8 pb-0">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-400 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 ring-4 ring-white dark:ring-zinc-900 overflow-hidden shrink-0">
                  {selectedCustomer.profile_image ? (
                    <img src={selectedCustomer.profile_image} alt={selectedCustomer.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedCustomer.full_name?.[0] || 'U'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    {selectedCustomer.full_name || 'Unnamed User'}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mt-1">
                    <span className="text-primary">@{selectedCustomer.username}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                      <Calendar size={12} />
                      Joined {new Date(selectedCustomer.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Current Plan</p>
                  <p className="text-xs font-black text-primary truncate">
                    {selectedCustomer.plan?.title || 'FREE PLAN'}
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Devices</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Smartphone size={12} className="text-emerald-500" />
                    {selectedCustomer.mapped_device_count || 0}
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Profiles</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Layers size={12} className="text-amber-500" />
                    {(selectedCustomer.personal_profile_count || 0) + (selectedCustomer.business_profile_count || 0) + (selectedCustomer.pet_profile_count || 0) + (selectedCustomer.sos_profile_count || 0) + (selectedCustomer.store_front_profile_count || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body - Detailed Tabs/Sections */}
            <div className="p-8 space-y-8 max-h-[50vh] overflow-y-auto custom-scrollbar">

              {/* Profile Details Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Profile Distribution</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Personal Profiles', count: selectedCustomer.personal_profile_count, icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Business Profiles', count: selectedCustomer.business_profile_count, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Pet Profiles', count: selectedCustomer.pet_profile_count, icon: PawPrint, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'SOS Profiles', count: selectedCustomer.sos_profile_count, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Storefront Profiles', count: selectedCustomer.store_front_profile_count, icon: Store, color: 'text-purple-500', bg: 'bg-purple-50' },
                  ].map((profile, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", profile.bg, "dark:bg-opacity-10")}>
                          <profile.icon className={cn("w-4 h-4", profile.color)} />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{profile.label}</span>
                      </div>
                      <span className={cn("text-xs font-black px-2.5 py-1 rounded-lg", profile.count > 0 ? profile.bg + " " + profile.color : "bg-gray-50 text-gray-300 dark:bg-zinc-800/50")}>
                        {profile.count || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Mapped Devices</h4>
                {selectedCustomer.devices?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.devices.map((device, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm group hover:border-emerald-200 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500">
                            <Cpu size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">{device.device_name}</span>
                            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter font-black">Code: {device.code}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/50 dark:bg-emerald-900/10 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                          <Hash size={10} />
                          #{device.id}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-dashed border-gray-200 dark:border-zinc-700 text-center">
                    <Cpu size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No devices mapped</p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Contact Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={12} className="text-blue-500" />
                      <span className="text-[10px] uppercase font-black text-gray-400">Email</span>
                    </div>
                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">{selectedCustomer.email}</p>
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50/50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 text-center">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full py-4 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-100 transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Customers;

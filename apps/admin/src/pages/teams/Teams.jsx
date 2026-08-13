import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Users,
  Shield,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  Eye,
  Info,
  Clock,
  Briefcase,
  Layers,
  Cpu as ChipIcon,
  Smartphone
} from 'lucide-react';
import { useGetTeamsQuery } from '../../store/api/teamsApi';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const itemsPerPage = 20;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: apiResponse, isLoading, error, refetch, isFetching } = useGetTeamsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
  });

  const teams = apiResponse?.data?.list || [];
  const pagination = apiResponse?.data?.pagination;
  const totalPages = pagination?.total_pages || 1;

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="text-primary" />
              Teams
            </h2>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {pagination?.total?.toLocaleString() || teams.length} TOTAL
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage user teams and their collaborations.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
          title="Refresh"
        >
          <RotateCcw className={cn("w-5 h-5", isFetching && "animate-spin")} />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by team name or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-gray-900 dark:text-white"
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
            <p className="text-gray-500 font-medium">Loading teams...</p>
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
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Team Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4 text-center">Members</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {teams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Shield size={20} />
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{team.team_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]" title={team.team_description}>
                          {team.team_description || 'No description provided.'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{team.owner?.full_name || 'System'}</span>
                          <span className="text-[10px] text-gray-400">{team.owner?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/10 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20">
                          <Users size={12} />
                          {team.total_members || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                        {formatDate(team.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedTeam(team);
                            setIsDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
                        >
                          <Eye size={12} />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {teams.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-300">
                            <Shield size={32} />
                          </div>
                          <p className="text-gray-500 font-medium">No teams found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/30 dark:bg-zinc-800/20">
                <p className="text-sm text-gray-500">
                  Page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isFetching}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTeam && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0 -z-10" onClick={() => setIsDetailModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header - Dossier Style */}
            <div className="p-10 pb-0">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 shadow-inner group overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                    <Shield size={40} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Facile Team Dossier</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight truncate">
                    {selectedTeam.team_name}
                  </h3>
                  <div className="flex items-center gap-3 text-gray-500 mt-2 font-bold no-underline">
                    <span className="text-primary italic">#{selectedTeam.id}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                      <Calendar size={12} />
                      Created {new Date(selectedTeam.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid - More Compact */}
              <div className="grid grid-cols-2 gap-2 mt-6">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-widest leading-none mb-1">Members</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">
                      {selectedTeam.total_members || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/50">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-widest leading-none mb-1">Status</p>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 leading-none uppercase">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-10 space-y-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Team Overview</h4>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 content text-xs font-medium text-gray-600 dark:text-zinc-400 leading-relaxed italic">
                  "{selectedTeam.team_description || 'No detailed description available for this team.'}"
                </div>
              </div>

              {/* Leadership Section - Compact & Elegant */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Team Leadership</h4>
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-lg font-black border border-primary/20 shadow-inner shrink-0 transition-transform">
                      {selectedTeam.owner?.full_name?.[0] || 'O'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">
                          {selectedTeam.owner?.full_name || 'Team Owner'}
                        </p>
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase">Owner</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                        <Mail size={10} className="text-primary/40" />
                        {selectedTeam.owner?.email}
                      </div>
                    </div>
                  </div>

                  {/* Owner Stats Row - Minimalist */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-zinc-800/50">
                    <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl bg-gray-100/30 dark:bg-zinc-950/30 border border-gray-100/50 dark:border-zinc-800/50">
                      <div className="flex items-center gap-1.5">
                        <Layers size={10} className="text-amber-500/70" />
                        <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase">Profiles</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-900 dark:text-white">{selectedTeam.owner?.profile_counts?.total || 0}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl bg-gray-100/30 dark:bg-zinc-950/30 border border-gray-100/50 dark:border-zinc-800/50">
                      <div className="flex items-center gap-1.5">
                        <ChipIcon size={10} className="text-emerald-500/70" />
                        <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase">Devices</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-900 dark:text-white">{selectedTeam.owner?.mapped_device_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Members Section */}
              {selectedTeam.members?.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 text-[10px]">Mapped Members</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedTeam.members.map((member) => (
                      <div key={member.id} className="group p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-primary/20 transition-all space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-primary font-black text-lg border border-gray-100 dark:border-zinc-700 group-hover:bg-primary/5 transition-colors">
                              {member.full_name?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-black text-gray-900 dark:text-white leading-none truncate uppercase tracking-tight">{member.full_name}</span>
                              <span className="text-[10px] text-gray-400 mt-1 font-bold truncate">{member.email}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase",
                            member.status === 'ACCEPTED'
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400"
                              : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                          )}>
                            {member.status}
                          </div>
                        </div>

                        {/* Member Stats Row */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                          <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100/30 dark:bg-zinc-950/30 border border-gray-100/50 dark:border-zinc-800/50">
                            <div className="flex items-center gap-1.5">
                              <Layers size={10} className="text-amber-500/70" />
                              <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase">Profiles</span>
                            </div>
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">{member.profile_counts?.total || 0}</span>
                          </div>
                          <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100/30 dark:bg-zinc-950/30 border border-gray-100/50 dark:border-zinc-800/50">
                            <div className="flex items-center gap-1.5">
                              <ChipIcon size={10} className="text-emerald-500/70" />
                              <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase">Devices</span>
                            </div>
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">{member.mapped_device_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-gray-50/50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 text-center">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full py-4 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
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

export default Teams;

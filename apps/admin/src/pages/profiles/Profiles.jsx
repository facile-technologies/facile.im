import React, { useState } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  X,
  RotateCcw
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import {
  useGetPlatformsQuery,
  useCreatePlatformMutation,
  useUpdatePlatformMutation,
  useDeletePlatformMutation
} from '../../store/api/platformApi';
import { cn } from '../../utils/cn';

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // API Hooks
  const { data, isLoading, isError, refetch } = useGetPlatformsQuery({
    page: currentPage,
    limit: itemsPerPage
  });

  const [createPlatform, { isLoading: isCreating }] = useCreatePlatformMutation();
  const [updatePlatform, { isLoading: isUpdating }] = useUpdatePlatformMutation();
  const [deletePlatform, { isLoading: isDeleting }] = useDeletePlatformMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'social',
    start_link: '',
    default_icon: '',
    black_icon: '',
    stroked_icon: '',
    colored_icon: '',
    white_icon: ''
  });

  const platforms = data?.data?.list || [];

  const handleOpenModal = (platform = null) => {
    if (platform) {
      setIsEditing(true);
      setSelectedId(platform.id);
      setFormData({
        name: platform.name,
        type: (platform.type || 'SOCIAL').toUpperCase(),
        start_link: platform.start_link,
        default_icon: platform.default_icon || '',
        black_icon: platform.black_icon || '',
        stroked_icon: platform.stroked_icon || '',
        colored_icon: platform.colored_icon || '',
        white_icon: platform.white_icon || ''
      });
    } else {
      setIsEditing(false);
      setSelectedId(null);
      setFormData({
        name: '',
        type: 'SOCIAL',
        start_link: '',
        default_icon: '',
        black_icon: '',
        stroked_icon: '',
        colored_icon: '',
        white_icon: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePlatform({ id: selectedId, ...formData }).unwrap();
        toast.success('Link updated successfully');
      } else {
        await createPlatform(formData).unwrap();
        toast.success('Link created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = (platform) => {
    setItemToDelete(platform);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deletePlatform(itemToDelete.id).unwrap();
      toast.success('Link deleted successfully');
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete');
    }
  };

  // Filter Logic (Local fallback if API search isn't available)
  const filteredPlatforms = platforms.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Links</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and organize your platform redirect links.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add Link</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => refetch()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              <RotateCcw className={cn("w-5 h-5", isLoading && "animate-spin")} />

            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading platform links...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-4">
                <X size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Failed to load data</h3>
              <p className="text-gray-500 max-w-xs mb-6">Something went wrong while fetching the platforms. Please try again.</p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
              >
                Try Again
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Link</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredPlatforms.map((platform) => (
                  <tr key={platform.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    {/* Image Column */}
                    <td className="px-6 py-4">
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm p-1.5"
                        dangerouslySetInnerHTML={{ __html: platform.default_icon }}
                      />
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white capitalize">
                      {platform.name}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700">
                        {platform.type}
                      </span>
                    </td>

                    {/* Start Link */}
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono italic">
                      {platform.start_link}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(platform)}
                          className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-400 hover:text-primary hover:border-primary dark:hover:text-primary hover:bg-primary/5 transition-all shadow-sm group"
                          title="Edit Link"
                        >
                          <Edit2 size={16} className="transition-transform group-hover:scale-110" />
                        </button>
                        <button
                          onClick={() => handleDelete(platform)}
                          className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-400 hover:text-red-500 hover:border-red-500 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shadow-sm group"
                          title="Delete Link"
                        >
                          <Trash2 size={16} className="transition-transform group-hover:scale-110" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {data?.data?.pagination && (
          <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-gray-500">
            <p className="text-sm italic">
              Showing <span className="font-bold">{platforms.length}</span> results
            </p>
            <div className="flex gap-2 text-gray-500">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!data?.data?.pagination?.hasMore}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200 text-gray-900 dark:text-white">
          <div className="absolute inset-0 -z-10" onClick={() => !isCreating && !isUpdating && setIsModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black">{isEditing ? 'Update Platform' : 'Add New Platform'}</h3>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Configure redirect details and styling icons</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-400 ml-4 tracking-widest italic">Platform Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Instagram"
                      className="w-full px-6 py-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-400 ml-4 tracking-widest italic">Type</label>
                    <div className="relative">
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-6 py-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="social">Social Media</option>
                        <option value="contacts">Contacts</option>
                        <option value="music">Music</option>
                        <option value="payment">Payment</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="others">Others</option>
                      </select>
                      <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-400 ml-4 tracking-widest italic">Start Link (URL Pattern)</label>
                  <input
                    required
                    type="text"
                    value={formData.start_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_link: e.target.value }))}
                    placeholder="e.g. https://instagram.com/"
                    className="w-full px-6 py-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-400 ml-4 tracking-widest italic font-mono">SVG Icons (SVG Code or Base64)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-500 ml-2">Default (Required)</span>
                      <textarea
                        required
                        value={formData.default_icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, default_icon: e.target.value }))}
                        placeholder="Paste SVG code here..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary transition-all outline-none text-xs font-mono h-28 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-500 ml-2">Black</span>
                      <textarea
                        value={formData.black_icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, black_icon: e.target.value }))}
                        placeholder="Paste SVG code here..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary transition-all outline-none text-xs font-mono h-28 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-500 ml-2">Stroked</span>
                      <textarea
                        value={formData.stroked_icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, stroked_icon: e.target.value }))}
                        placeholder="Paste SVG code here..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary transition-all outline-none text-xs font-mono h-28 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-500 ml-2">Colored</span>
                      <textarea
                        value={formData.colored_icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, colored_icon: e.target.value }))}
                        placeholder="Paste SVG code here..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary transition-all outline-none text-xs font-mono h-28 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-500 ml-2">White</span>
                      <textarea
                        value={formData.white_icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, white_icon: e.target.value }))}
                        placeholder="Paste SVG code here..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:border-primary transition-all outline-none text-xs font-mono h-28 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 outline-none"
                  >
                    {(isCreating || isUpdating) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      isEditing ? 'Update Platform' : 'Create Platform'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0 -z-10" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center text-gray-900 dark:text-white">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black mb-2">Are you sure?</h3>
              <p className="text-gray-500 dark:text-zinc-400 mb-8 px-4 font-medium">
                You are about to delete <span className="font-bold text-gray-700 dark:text-white">"{itemToDelete?.name}"</span>. This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Profiles;

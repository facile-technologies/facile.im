import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Cpu,
  MoreVertical,
  Loader2,
  AlertCircle,
  X,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import {
  useGetNfcCodesQuery,
  useGetDevicesQuery,
  useGenerateNfcCodesMutation,
  useUpdateNfcChipMutation
} from '../../store/api/nfcApi';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const NfcChipsPage = () => {
  const { status } = useParams(); // 'produced', 'mapped', 'unmapped', 'deactivated'
  const activeTab = status || 'produced';

  // Filter States
  const [searchCode, setSearchCode] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Generate Modal States
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [genChipCount, setGenChipCount] = useState('');
  const [genSelectedProduct, setGenSelectedProduct] = useState('');

  // Update Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    username: '',
    unmap: false
  });

  const [generateNfcCodes, { isLoading: isGenerating }] = useGenerateNfcCodesMutation();
  const [updateNfcChip, { isLoading: isUpdating }] = useUpdateNfcChipMutation();

  const debouncedCode = useDebounce(searchCode, 300);
  const debouncedUsername = useDebounce(searchUsername, 300);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (id, url) => {
    if (!url) {
      toast.error('No link available');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  // Reset page and filters when tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchCode('');
    setSearchUsername('');
    setSelectedProduct('');
  }, [activeTab]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedCode, debouncedUsername, selectedProduct]);

  // Fetch data using RTK Query
  const combinedSearch = [debouncedCode, debouncedUsername, selectedProduct].filter(Boolean).join(' ');

  const { data: apiResponse, isLoading, error, refetch, isFetching } = useGetNfcCodesQuery({
    tab: activeTab,
    page: currentPage,
    limit: itemsPerPage,
    search: combinedSearch || undefined,
  });

  const { data: devicesResponse } = useGetDevicesQuery();
  const productList = devicesResponse?.data || [];

  const nfcList = apiResponse?.data?.list || [];
  const pagination = apiResponse?.data?.pagination || {
    total: 0,
    total_pages: 1
  };

  // Formatted Title
  const title = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Cpu className="text-primary" />
            NFC Chips - {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your {title.toLowerCase()} NFC inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center"
            title="Refresh"
          >
            <RotateCcw className={cn("w-5 h-5", isFetching && "animate-spin")} />
          </button>
          {activeTab === 'produced' && (
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
            >
              + Generate Chips
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {/* Tools */}
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Code..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          {activeTab === 'mapped' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          )}

          <div className="relative w-full sm:w-64">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <option value="">All Products</option>
              {productList.map((product) => (
                <option key={product.id} value={product.title}>
                  {product.title}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Filter size={16} />
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={() => {
                setSearchCode('');
                setSearchUsername('');
                setSelectedProduct('');
              }}
              className="text-gray-500 hover:text-primary text-sm font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium">Loading NFC codes...</p>
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
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Code</th>
                    {activeTab !== 'produced' && (
                      <>
                        <th className="px-6 py-4">Mapped Profile</th>
                        <th className="px-6 py-4">Username</th>
                      </>
                    )}
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created At</th>
                    {activeTab !== 'produced' && <th className="px-6 py-4">Activation Date</th>}
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {nfcList.map((chip) => (
                    <tr key={chip.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 group/code">
                          <span className="font-medium text-primary">{chip.code}</span>
                          <button
                            onClick={() => handleCopy(chip.id, chip.user?.profile_url)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition-all opacity-0 group-hover/code:opacity-100"
                            title="Copy profile link"
                          >
                            {copiedId === chip.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                      {activeTab !== 'produced' && (
                        <>
                          <td className="px-6 py-4">
                            {chip.user ? (
                              <a
                                href={chip.user.profile_url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all"
                              >
                                View Profile
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {chip.user?.username || '-'}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 rounded px-2 py-1">
                          {chip.device_name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          chip.status === 'DEACTIVATED'
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                        )}>
                          {chip.status === 'DEACTIVATED' ? 'inactive' : 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(chip.created_at)}
                      </td>
                      {activeTab !== 'produced' && (
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(chip.activation_date)}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedChip(chip);
                            setUpdateForm({
                              status: chip.status === 'DEACTIVATED' ? 'inactive' : 'active',
                              username: (activeTab === 'unmapped' || activeTab === 'produced') ? '' : (chip.user?.username || ''),
                              unmap: false
                            });
                            setIsUpdateModalOpen(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                  {nfcList.length === 0 && (
                    <tr>
                      <td colSpan={activeTab !== 'produced' ? 8 : 4} className="px-6 py-12 text-center text-gray-500">
                        No chips found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="p-5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="font-medium text-gray-900 dark:text-white">{pagination.total}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={isFetching}
                        className={cn(
                          "w-10 h-10 text-sm font-medium rounded-xl transition-all",
                          currentPage === page
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-gray-400"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                    {pagination.total_pages > 5 && <span className="mx-1 text-gray-400">...</span>}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                    disabled={currentPage === pagination.total_pages || isFetching}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Generate Chips Modal */}
      {isGenerateModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsGenerateModalOpen(false)}
          />
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generate NFC Chips</h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Chips
                </label>
                <input
                  type="number"
                  placeholder="Enter count (e.g. 100)"
                  value={genChipCount}
                  onChange={(e) => setGenChipCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Product
                </label>
                <div className="relative">
                  <select
                    value={genSelectedProduct}
                    onChange={(e) => setGenSelectedProduct(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer text-gray-600 dark:text-gray-300"
                  >
                    <option value="">Select a product</option>
                    {productList.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Filter size={16} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                Note: These NFC chips will also be marked as active.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!genChipCount || !genSelectedProduct) {
                    toast.error('Please fill all fields');
                    return;
                  }

                  try {
                    const res = await generateNfcCodes({
                      device_type: genSelectedProduct,
                      quantity: Number(genChipCount)
                    }).unwrap();

                    if (res.status) {
                      toast.success(res.message || 'NFC codes generated successfully');

                      // Download CSV
                      if (res.data?.csv_url) {
                        const link = document.createElement('a');
                        link.href = res.data.csv_url;
                        link.setAttribute('download', '');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }

                      setIsGenerateModalOpen(false);
                      setGenChipCount('');
                      setGenSelectedProduct('');
                      refetch();
                    }
                  } catch (err) {
                    toast.error(err?.data?.message || 'Failed to generate NFC chips');
                  }
                }}
                disabled={isGenerating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Export'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Update Chip Modal (Mapped, Unmapped, Deactivated & Produced) */}
      {isUpdateModalOpen && selectedChip && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsUpdateModalOpen(false)}
          />
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 relative">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update NFC Chip</h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
                <input
                  type="text"
                  readOnly
                  value={selectedChip.code}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                <input
                  type="text"
                  readOnly
                  value={selectedChip.device_name || '-'}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  placeholder="No username"
                  value={updateForm.username || '-'}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div className="flex gap-2">
                  <button
                    disabled={updateForm.unmap}
                    onClick={() => setUpdateForm(prev => ({ ...prev, status: 'active' }))}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-sm font-bold transition-all border",
                      updateForm.status === 'active'
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-gray-50 dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700",
                      updateForm.unmap && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {activeTab === 'deactivated' ? 'ReActivate Chip' : 'Active'}
                  </button>
                  <button
                    disabled={updateForm.unmap}
                    onClick={() => setUpdateForm(prev => ({ ...prev, status: 'inactive' }))}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-sm font-bold transition-all border",
                      updateForm.status === 'inactive'
                        ? "bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 border-zinc-800 dark:border-white shadow-lg shadow-black/10"
                        : "bg-gray-50 dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700",
                      updateForm.unmap && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {activeTab === 'mapped' && (
                <div className="pt-2">
                  <div
                    onClick={() => setUpdateForm(prev => ({ ...prev, unmap: !prev.unmap }))}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border",
                      updateForm.unmap
                        ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
                        : "bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 hover:border-red-100"
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={cn(
                        "text-sm font-bold transition-colors",
                        updateForm.unmap ? "text-red-600" : "text-gray-700 dark:text-gray-300"
                      )}>
                        UnMap Chip
                      </span>
                      <span className="text-xs text-gray-500">Disconnect user profile</span>
                    </div>
                    <div className={cn(
                      "w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out",
                      updateForm.unmap ? "bg-red-500" : "bg-gray-200 dark:bg-zinc-700"
                    )}>
                      <div className={cn(
                        "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out",
                        updateForm.unmap && "translate-x-5"
                      )} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  let payload = {};
                  if (activeTab === 'deactivated') {
                    if (updateForm.status === 'active') {
                      payload = {
                        action: selectedChip.user_id ? "ASSIGNED" : "PRODUCED"
                      };
                    } else {
                      toast.error('Chip is already deactivated');
                      return;
                    }
                  } else if (updateForm.unmap) {
                    payload = { action: "UNMAP" };
                  } else {
                    const originalStatus = selectedChip.status === 'DEACTIVATED' ? 'inactive' : 'active';

                    if (updateForm.status !== originalStatus) {
                      payload = {
                        action: updateForm.status === 'inactive' ? 'DEACTIVATE' : 'ACTIVATE'
                      };
                    } else {
                      toast.error('No changes detected');
                      return;
                    }
                  }

                  try {
                    const res = await updateNfcChip({
                      id: selectedChip.id,
                      ...payload
                    }).unwrap();

                    if (res.status) {
                      toast.success(res.message || 'Chip updated successfully');
                      setIsUpdateModalOpen(false);
                      refetch();
                    }
                  } catch (err) {
                    toast.error(err?.data?.message || 'Failed to update chip');
                  }
                }}
                disabled={isUpdating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NfcChipsPage;

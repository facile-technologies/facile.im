import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Filter,
  Files,
  Plus,
  CheckCircle2,
  Clock,
  Tag,
  X,
  PlusCircle,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  RotateCcw,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useGetPlansQuery, useCreatePlanMutation, useUpdatePlanMutation, useDeletePlanMutation } from '../../store/api/planApi';
import { toast } from 'react-hot-toast';

const BusinessPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Form State
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    duration: 'Monthly',
    price: '',
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');

  const { data: apiResponse, isLoading, error, refetch, isFetching } = useGetPlansQuery();
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      const res = await deletePlan(planToDelete.id).unwrap();
      if (res.status) {
        toast.success(res.message || 'Plan deleted successfully!');
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete plan');
    }
  };

  const handleAddFeature = (e) => {
    if (e.key === 'Enter' && featureInput.trim()) {
      e.preventDefault();
      if (!newPlan.features.includes(featureInput.trim())) {
        setNewPlan({
          ...newPlan,
          features: [...newPlan.features, featureInput.trim()]
        });
      }
      setFeatureInput('');
    }
  };

  const removeFeature = (featureToRemove) => {
    setNewPlan({
      ...newPlan,
      features: newPlan.features.filter(f => f !== featureToRemove)
    });
  };


  const handleEdit = (plan) => {
    setNewPlan({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      duration: plan.duration,
      price: plan.price.toString(),
      features: [...plan.features]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newPlan.title,
        description: newPlan.description,
        duration: newPlan.duration,
        price: parseFloat(newPlan.price),
        features: newPlan.features
      };

      let res;
      if (newPlan.id) {
        res = await updatePlan({ id: newPlan.id, ...payload }).unwrap();
      } else {
        res = await createPlan(payload).unwrap();
      }

      if (res.status) {
        toast.success(res.message || 'Action successful!');
        setIsModalOpen(false);
        setNewPlan({ title: '', description: '', duration: 'Monthly', price: '', features: [] });
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }
  };

  const allPlans = apiResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Files className="text-primary" />
            Business Plans
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Design and manage subscription plans for your business clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 hover:text-primary transition-all disabled:opacity-50 shadow-sm"
            title="Refresh Plans"
          >
            <RotateCcw className={cn("w-5 h-5", isFetching && "animate-spin")} />
          </button>
          <button
            onClick={() => {
              setNewPlan({ title: '', description: '', duration: 'Monthly', price: '', features: [] });
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Plan
          </button>
        </div>
      </div>

      {/* Plans Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 font-medium">Loading business plans...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500/20" />
          <div className="text-center">
            <h4 className="text-gray-900 dark:text-white font-bold">Failed to load plans</h4>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">{error?.data?.message || 'The server might be down or unreachable.'}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-6 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-200 dark:border-zinc-800 shadow-2xl shadow-gray-200/40 dark:shadow-none flex flex-col group hover:border-primary/40 hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Tag size={24} />
                </div>
                <div className="flex bg-gray-100/50 dark:bg-zinc-800 p-1 rounded-xl border border-gray-100 dark:border-zinc-700/50">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200",
                    plan.duration === 'Monthly'
                      ? "bg-white dark:bg-zinc-700 text-primary dark:text-white shadow-sm"
                      : "text-gray-400 dark:text-zinc-600"
                  )}>Month</span>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200",
                    plan.duration === 'Yearly'
                      ? "bg-white dark:bg-zinc-700 text-primary dark:text-white shadow-sm"
                      : "text-gray-400 dark:text-zinc-600"
                  )}>Year</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 min-h-[40px]">{plan.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-gray-400 font-bold text-sm">/{plan.duration === 'Monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Included Features</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-6 border-t border-gray-100 dark:border-zinc-800 font-bold">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-xs text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-all"
                >
                  Edit Plan
                </button>
                <button
                  onClick={() => {
                    setPlanToDelete(plan);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal via Portal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    {newPlan.id ? 'Edit Plan' : 'Create New Plan'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Define membership perks and pricing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Plan Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., Growth"
                      value={newPlan.title}
                      onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Duration</label>
                    <select
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Briefly describe who this plan is for..."
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Features</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Add a feature and press Enter..."
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={handleAddFeature}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                    />
                    <PlusCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  </div>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newPlan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary animate-in zoom-in-50 duration-200">
                        {feature}
                        <button type="button" onClick={() => removeFeature(feature)} className="hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {newPlan.features.length === 0 && (
                      <p className="text-xs text-gray-400 italic pl-1">No features added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-gray-50/50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-full py-4 rounded-2xl bg-primary text-white text-sm font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUpdating ? 'Updating...' : 'Publishing...'}
                    </>
                  ) : (
                    <>
                      {newPlan.id ? 'Save Changes' : 'Publish Plan'}
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0 -z-10" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200 p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-2">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Delete Plan?</h3>
              <p className="text-gray-500 text-sm">
                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{planToDelete?.title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-4 rounded-2xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Delete Plan'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BusinessPlans;

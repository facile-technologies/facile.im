import React, { useState } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';

const BusinessRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Data
  const requests = [
    { id: 'REQ-1001', business: 'Tech Corp Ltd', contact: 'John Manager', email: 'john@techcorp.com', quantity: 500, date: '2024-01-25', status: 'Pending' },
    { id: 'REQ-1002', business: 'Style Boutique', contact: 'Sarah Owner', email: 'sarah@style.com', quantity: 50, date: '2024-01-24', status: 'Approved' },
    { id: 'REQ-1003', business: 'Mega Gym', contact: 'Mike Trainer', email: 'mike@megagym.com', quantity: 200, date: '2024-01-23', status: 'Rejected' },
    { id: 'REQ-1004', business: 'Cafe Delight', contact: 'Emma Barista', email: 'emma@cafe.com', quantity: 100, date: '2024-01-22', status: 'Pending' },
    { id: 'REQ-1005', business: 'Urban Hotel', contact: 'David Hotelier', email: 'david@urban.com', quantity: 1000, date: '2024-01-21', status: 'Approved' },
  ];

  // Filter Logic
  const filteredRequests = requests.filter(req =>
    req.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="text-primary" />
            Business Requests
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage incoming bulk NFC chip requests from businesses.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
          Create Request
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
              placeholder="Search Business or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-medium transition-colors">
              <Filter size={18} />
              <span>Filter Status</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Business Details</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{req.id}</td>

                  {/* Business Details */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{req.business}</span>
                      <span className="text-xs text-gray-500">{req.contact} • {req.email}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{req.quantity} Chips</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{req.date}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : req.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                          : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                      }`}>
                      {req.status === 'Approved' && <CheckCircle size={12} />}
                      {req.status === 'Rejected' && <XCircle size={12} />}
                      {req.status === 'Pending' && <Clock size={12} />}
                      {req.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-primary transition-colors" title="View Details">
                      <Eye size={18} />
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

export default BusinessRequests;

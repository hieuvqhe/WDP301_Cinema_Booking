import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, User, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

type Contract = {
  _id: string;
  staff_id: string;
  admin_id: string;
  contract_number: string;
  staff_name: string | null;
  staff_email: string | null;
  staff_phone: string | null;
  theater_name: string | null;
  theater_location: string | null;
  salary: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'terminated' | 'expired';
  terms: string;
  responsibilities: string[];
  benefits: string[];
  contract_file_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
  staff: {
    _id: string;
    email: string;
    name: string;
    avatar: string;
    phone?: string;
  };
  admin: {
    _id: string;
    email: string;
    name: string;
  };
};

interface ContractDetailModalProps {
  contract: Contract;
  onClose: () => void;
}

interface EditContractModalProps {
  contract: Contract;
  onClose: () => void;
  onSave: (contractId: string, data: {
    position?: string;
    salary?: number;
    contract_type?: 'full_time' | 'part_time' | 'contract';
    start_date?: string;
    end_date?: string;
    benefits?: string[];
    terms?: string;
  }) => void;
}

interface TerminateContractModalProps {
  contract: Contract;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ContractDetailModal = ({ contract, onClose }: ContractDetailModalProps) => {
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'terminated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expired': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Contract Details</h2>
                <p className="text-gray-400">{contract.contract_number}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
          </div>

          {/* Staff Information */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Staff Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white">{contract.staff.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white">{contract.staff.email}</p>
              </div>
              {contract.staff.phone && (
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <p className="text-white">{contract.staff.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contract Information */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Contract Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Start Date</label>
                <p className="text-white">{new Date(contract.start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">End Date</label>
                <p className="text-white">{new Date(contract.end_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Salary</label>
                <p className="text-white font-semibold">{formatSalary(contract.salary)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Created</label>
                <p className="text-white">{new Date(contract.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {contract.benefits && contract.benefits.length > 0 && (
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {contract.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm border border-teal-500/30"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Terms */}
          {contract.terms && (
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Terms & Conditions</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{contract.terms}</p>
            </div>
          )}

          {/* Admin Information */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Created By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {contract.admin.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{contract.admin.name}</p>
                <p className="text-gray-400 text-sm">{contract.admin.email}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const EditContractModal = ({ contract, onClose, onSave }: EditContractModalProps) => {
  const [formData, setFormData] = useState({
    position: '',
    salary: contract.salary,
    contract_type: 'full_time' as 'full_time' | 'part_time' | 'contract',
    start_date: contract.start_date.split('T')[0],
    end_date: contract.end_date.split('T')[0],
    benefits: contract.benefits.join(', '),
    terms: contract.terms
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(contract._id, {
      ...formData,
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit Contract</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="Enter position"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contract Type</label>
            <select
              value={formData.contract_type}
              onChange={(e) => setFormData({ ...formData, contract_type: e.target.value as any })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Benefits (comma separated)</label>
            <input
              type="text"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              placeholder="Health insurance, Paid leave, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              placeholder="Enter terms and conditions..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-600/50 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg hover:from-teal-600 hover:to-green-600 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const TerminateContractModal = ({ contract, onClose, onConfirm }: TerminateContractModalProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm max-w-md w-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Terminate Contract</h2>
              <p className="text-gray-400">{contract.contract_number}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              This action will terminate the contract for <strong>{contract.staff.name}</strong>. 
              This cannot be undone.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for termination</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="Enter reason for termination..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-600/50 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
            >
              Terminate Contract
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

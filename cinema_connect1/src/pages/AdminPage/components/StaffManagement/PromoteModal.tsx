import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Calendar, DollarSign, FileText, Gift } from 'lucide-react';
import type { AdminUser } from '../../../../types/Admin.type';

interface PromoteModalProps {
  customer: AdminUser;
  onClose: () => void;
  onSubmit: (contractData: {
    position: string;
    salary: number;
    start_date: string;
    end_date: string;
    contract_type: 'full_time' | 'part_time' | 'contract';
    benefits: string[];
    terms: string;
  }) => void;
}

export const PromoteModal = ({ customer, onClose, onSubmit }: PromoteModalProps) => {
  const [formData, setFormData] = useState({
    position: '',
    salary: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    contract_type: 'full_time' as 'full_time' | 'part_time' | 'contract',
    benefits: [] as string[],
    terms: ''
  });

  const [benefitInput, setBenefitInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.position || !formData.salary || !formData.start_date || !formData.end_date || !formData.terms) {
      return;
    }

    setLoading(true);
    try {
      // Convert dates to ISO format
      const startDate = new Date(formData.start_date).toISOString();
      const endDate = new Date(formData.end_date).toISOString();
      
      await onSubmit({
        ...formData,
        start_date: startDate,
        end_date: endDate
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-700/80 to-slate-800/80 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Promote to Staff</h2>
              <p className="text-sm text-gray-400">Create contract for {customer.name}</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {customer.avatar ? (
                    <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                  ) : (
                    customer.name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
                {customer.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white ml-2">{customer.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Member since:</span>
                  <span className="text-white ml-2">{new Date(customer.created_at).toLocaleDateString()}</span>
                </div>
                {customer.stats && (
                  <div>
                    <span className="text-gray-400">Bookings:</span>
                    <span className="text-white ml-2">{customer.stats.bookings_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contract Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Position *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g., Manager, Assistant, etc."
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Salary (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="10000"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Contract Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contract Type *
                </label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, contract_type: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Gift className="inline w-4 h-4 mr-1" />
                Benefits
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Add a benefit..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                />
                <motion.button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </motion.button>
              </div>
              {formData.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30 flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(index)}
                        className="text-green-300 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Terms & Conditions *
              </label>
              <textarea
                required
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Enter contract terms and conditions..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-700/50">
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-600/50 text-gray-300 rounded-lg hover:bg-slate-600/70 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Promoting...' : 'Promote to Staff'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

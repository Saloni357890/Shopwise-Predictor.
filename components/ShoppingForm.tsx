
import React, { useState } from 'react';
import { ShoppingCategory, ShoppingFormData } from '../types';

interface ShoppingFormProps {
  onPredict: (data: ShoppingFormData) => void;
  loading: boolean;
}

const ShoppingForm: React.FC<ShoppingFormProps> = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState<ShoppingFormData>({
    budget: 1000,
    category: ShoppingCategory.GROCERIES,
    billDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.billDetails.trim()) return;
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">How much are you planning to spend? (Rupees ₹)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
            placeholder="e.g. 5000"
            required
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">What category is this shopping for?</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 bg-white"
        >
          {Object.values(ShoppingCategory).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Describe your list or bill details</label>
        <textarea
          value={formData.billDetails}
          onChange={(e) => setFormData({ ...formData, billDetails: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 min-h-[120px]"
          placeholder="e.g. 2kg Basmati Rice, 1L Sunflower Oil, 500g Chicken, some spices..."
          required
        />
        <p className="text-xs text-slate-500 italic">Example: "I want to buy 3 t-shirts, a pair of jeans, and some socks from a mall."</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center space-x-2 ${
          loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing Your List...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Predict Total Price</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ShoppingForm;

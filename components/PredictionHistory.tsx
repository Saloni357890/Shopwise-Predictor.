
import React, { useState } from 'react';
import { HistoryItem } from '../types';

interface PredictionHistoryProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ history, onDelete, onClear, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item => 
    item.formData.billDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.formData.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">No predictions yet</h3>
        <p className="text-slate-500 mt-2">Your past shopping lists will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search past lists or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <button 
          onClick={onClear}
          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHistory.map((item) => (
          <div 
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {formatDate(item.timestamp)}
                </span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold">
                  {item.formData.category}
                </span>
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                title="Delete entry"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <p className="text-slate-700 text-sm font-medium line-clamp-2 mb-4 h-10">
              {item.formData.billDetails}
            </p>

            <div className="flex items-end justify-between border-t border-slate-50 pt-4 mt-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Predicted Total</p>
                <p className="text-lg font-black text-indigo-600">₹{item.result.estimatedTotal}</p>
              </div>
              <button 
                onClick={() => onSelect(item)}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                View Results
              </button>
            </div>
          </div>
        ))}
        
        {filteredHistory.length === 0 && searchQuery && (
          <div className="col-span-full text-center py-8 text-slate-500">
            No history found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;

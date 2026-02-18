
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-6 px-4 mb-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ShopWise</h1>
            <p className="text-sm text-slate-500 font-medium">Your Personal Shopping Companion</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            AI-Powered Predictions
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

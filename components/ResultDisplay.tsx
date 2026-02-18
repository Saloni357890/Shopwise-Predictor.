
import React from 'react';
import { PredictionResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ResultDisplayProps {
  result: PredictionResult;
  budget: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, budget }) => {
  const chartData = result.items.map(item => ({
    name: item.name,
    value: item.estimatedPrice
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  const isOverBudget = result.estimatedTotal > budget;
  const difference = Math.abs(result.estimatedTotal - budget);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Friendly Note Hero */}
      <div className={`p-6 rounded-2xl border-l-8 shadow-sm flex flex-col md:flex-row items-center gap-6 ${
        isOverBudget ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
      }`}>
        <div className={`p-4 rounded-full ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}>
          {isOverBudget ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className={`text-xl font-bold mb-1 ${isOverBudget ? 'text-red-800' : 'text-green-800'}`}>
            {result.friendlyNote}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            I've estimated your total to be around <span className="font-bold">₹{result.estimatedTotal}</span>. 
            {isOverBudget 
              ? ` That's ₹${difference} more than your budget of ₹${budget}.` 
              : ` You're within your ₹${budget} budget by ₹${difference}! Excellent planning.`
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Itemized List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Estimated Breakdown
          </h3>
          <div className="space-y-3">
            {result.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">{item.quantity}</div>
                </div>
                <div className="text-indigo-600 font-bold">₹{item.estimatedPrice}</div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-200 mt-2 flex justify-between items-center">
              <span className="text-slate-900 font-bold uppercase tracking-wider text-sm">Estimated Total</span>
              <span className="text-2xl font-black text-indigo-700">₹{result.estimatedTotal}</span>
            </div>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Spending Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `₹${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Savings Tips & Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-indigo-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Shopping Tips for You
            </h3>
            <ul className="space-y-3">
              {result.savingsTips.map((tip, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-3 mt-1 bg-white/20 p-1 rounded-full text-xs">✨</span>
                  <span className="text-indigo-100 font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200 shadow-sm">
          <h3 className="text-amber-800 font-bold text-lg mb-2">Did You Know?</h3>
          <p className="text-amber-700 text-sm leading-relaxed italic">
            "{result.categoryAnalysis}"
          </p>
          <div className="mt-6 flex items-center text-xs text-amber-600 font-bold uppercase tracking-widest">
            <div className="h-[2px] w-8 bg-amber-400 mr-2"></div>
            Shopping Guide
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;

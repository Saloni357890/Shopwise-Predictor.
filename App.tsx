
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ShoppingForm from './components/ShoppingForm';
import ResultDisplay from './components/ResultDisplay';
import PredictionHistory from './components/PredictionHistory';
import { ShoppingFormData, PredictionResult, HistoryItem } from './types';
import { predictShoppingPrice } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<ShoppingFormData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'predict' | 'history'>('predict');

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('shopwise_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('shopwise_history', JSON.stringify(history));
  }, [history]);

  const handlePredict = async (data: ShoppingFormData) => {
    setLoading(true);
    setError(null);
    setLastFormData(data);
    try {
      const prediction = await predictShoppingPrice(data);
      setResult(prediction);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        formData: data,
        result: prediction
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Oops! Something went wrong while connecting with our AI assistant.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire prediction history?")) {
      setHistory([]);
    }
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setLastFormData(item.formData);
    setResult(item.result);
    setActiveTab('predict');
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLastFormData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4">
        {/* Navigation Tabs */}
        {!result && !loading && (
          <div className="flex justify-center mb-8">
            <div className="bg-slate-200/50 p-1.5 rounded-2xl flex space-x-1">
              <button 
                onClick={() => setActiveTab('predict')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${
                  activeTab === 'predict' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Predict Price
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center ${
                  activeTab === 'history' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Recent History
                {history.length > 0 && (
                  <span className="ml-2 bg-indigo-100 text-indigo-600 px-1.5 rounded text-[10px]">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        {!result && !loading && activeTab === 'predict' && (
          <div className="text-center mb-12 animate-in fade-in duration-1000">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Hello there! Ready to plan?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              I can help you predict the cost of your shopping trip before you even step out. 
            </p>
          </div>
        )}

        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'predict' ? (
            !result ? (
              <div className="max-w-xl mx-auto">
                <ShoppingForm onPredict={handlePredict} loading={loading} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={reset}
                    className="group flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    New Prediction
                  </button>
                  <div className="text-slate-400 text-sm font-medium">
                    Result for {lastFormData?.category}
                  </div>
                </div>
                
                <ResultDisplay 
                  result={result} 
                  budget={lastFormData?.budget || 0} 
                />
              </div>
            )
          ) : (
            <PredictionHistory 
              history={history} 
              onDelete={deleteHistoryItem}
              onClear={clearHistory}
              onSelect={selectHistoryItem}
            />
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-16 text-center text-slate-400 text-sm pb-8">
        <p>© {new Date().getFullYear()} ShopWise AI • Built with Gemini 3</p>
        <div className="flex justify-center space-x-4 mt-2">
          <span>Reliable</span>
          <span>•</span>
          <span>Friendly</span>
          <span>•</span>
          <span>Respectful</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

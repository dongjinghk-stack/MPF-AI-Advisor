import React, { useState } from 'react';
import { BarChart3, PieChart, ShieldCheck } from 'lucide-react';
import RankingsView from './components/Views/RankingsView';
import AnalyzerView from './components/Views/AnalyzerView';

function App() {
  const [activeTab, setActiveTab] = useState<'rankings' | 'analyzer'>('rankings');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Hong Kong MPF Fund Analyzer</h1>
              <p className="text-blue-200 text-sm mt-1 opacity-90">Professional Portfolio Optimization with AI Guidance</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
               <ShieldCheck className="w-4 h-4 text-green-400" />
               <span>Verified Data: MPFA Official Platform</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${activeTab === 'rankings' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Fund Rankings</span>
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${activeTab === 'analyzer' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <PieChart className="w-5 h-5" />
              <span>Portfolio Analyzer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="transition-opacity duration-300 ease-in-out">
          {activeTab === 'rankings' ? <RankingsView /> : <AnalyzerView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400">
            Disclaimer: The information provided is for reference only and does not constitute investment advice. 
            Returns are based on historical data.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React from 'react';
import { Brain, Database, LineChart, Settings, HelpCircle, Plus, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onNewResearch: () => void;
  onExitToLanding: () => void;
  brdCount: number;
}

export default function Sidebar({ currentPage, onPageChange, onNewResearch, onExitToLanding, brdCount }: SidebarProps) {
  return (
    <nav className="fixed left-0 top-0 h-full flex flex-col w-64 border-r border-gray-200 bg-white z-40">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2 cursor-pointer group" onClick={onExitToLanding}>
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center font-black text-white text-[11px] tracking-widest group-hover:bg-blue-600 transition-colors">
            A
          </div>
          <div>
            <h1 className="font-bold text-base text-black tracking-tight leading-none group-hover:text-blue-600 transition-colors">AutoResearch AI</h1>
            <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400 mt-1">Platform Ingress</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="font-mono text-[10px] text-gray-500 font-semibold tracking-wider">Power User</span>
          <span className="bg-neutral-100 text-neutral-800 font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-widest">PRO</span>
        </div>
      </div>

      {/* Primary Call to Action */}
      <div className="p-4">
        <button 
          onClick={onNewResearch}
          className="w-full bg-black text-white py-2.5 px-4 font-mono text-xs uppercase tracking-widest font-bold hover:shadow-[4px_4px_0px_#2170e4] border border-black hover:bg-neutral-800 transition-all active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Research
        </button>
      </div>

      {/* Navigation Categories */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
        <button
          onClick={() => onPageChange('generator')}
          className={`flex items-center gap-3 px-3 py-2.5 transition-colors font-mono text-xs uppercase tracking-wider font-semibold ${
            currentPage === 'generator'
              ? 'bg-neutral-100 text-black border-l-2 border-black font-bold'
              : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          <Brain className={`w-4 h-4 ${currentPage === 'generator' ? 'text-black' : 'text-gray-400'}`} />
          Generator
        </button>

        <button
          onClick={() => onPageChange('results')}
          className={`flex items-center gap-3 px-3 py-2.5 transition-colors font-mono text-xs uppercase tracking-wider font-semibold group ${
            currentPage === 'results'
              ? 'bg-neutral-100 text-black border-l-2 border-black font-bold'
              : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          <Database className={`w-4 h-4 ${currentPage === 'results' ? 'text-black' : 'text-gray-400'}`} />
          <span>Results</span>
          {brdCount > 0 && (
            <span className="ml-auto bg-black text-white font-mono text-[9px] px-1.5 py-0.1 font-black">
              {brdCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('analytics')}
          className={`flex items-center gap-3 px-3 py-2.5 transition-colors font-mono text-xs uppercase tracking-wider font-semibold ${
            currentPage === 'analytics'
              ? 'bg-neutral-100 text-black border-l-2 border-black font-bold'
              : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
        >
          <LineChart className={`w-4 h-4 ${currentPage === 'analytics' ? 'text-black' : 'text-gray-400'}`} />
          Analytics
        </button>
      </div>

      {/* Footer Navigation items */}
      <div className="mt-auto p-3 border-t border-gray-100 flex flex-col gap-1 bg-gray-50/50">
        <button 
          onClick={() => alert("Settings configuration panel is active. Credentials and API Keys are bound automatically at runtime.")}
          className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-black transition-colors font-mono text-[10px] uppercase font-bold tracking-wider text-left"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </button>
        <button 
          onClick={() => alert("AutoResearch AI Support Agent initialized. For API errors, verify that port 8000 is open on your target pipeline host.")}
          className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-black transition-colors font-mono text-[10px] uppercase font-bold tracking-wider text-left"
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
          Support Help
        </button>
        <button 
          onClick={onExitToLanding}
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors font-mono text-[10px] uppercase font-bold tracking-wider text-left"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Exit Platform
        </button>
      </div>
    </nav>
  );
}

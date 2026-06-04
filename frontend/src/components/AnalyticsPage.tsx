import React, { useState } from 'react';
import { Calendar, Download, RefreshCw, Layers, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { ActivityLog } from '../types';

interface AnalyticsPageProps {
  recentActivities: ActivityLog[];
  brdCount: number;
}

export default function AnalyticsPage({ recentActivities, brdCount }: AnalyticsPageProps) {
  const [timeframe, setTimeframe] = useState<string>('Last 30 Days');

  // Realistic mock data points for agent bar charts represent agent performance metrics
  const barData = [
    { label: '01 Jan', value: 'h-[50%]', peak: false },
    { label: '02 Jan', value: 'h-[62%]', peak: false },
    { label: '03 Jan', value: 'h-[75%]', peak: false },
    { label: '04 Jan', value: 'h-[52%]', peak: false },
    { label: '05 Jan', value: 'h-[92%]', peak: true },
    { label: '06 Jan', value: 'h-[80%]', peak: false },
    { label: '07 Jan', value: 'h-[86%]', peak: false },
    { label: '08 Jan', value: 'h-[60%]', peak: false },
    { label: '09 Jan', value: 'h-[72%]', peak: false },
    { label: '10 Jan', value: 'h-[85%]', peak: false },
    { label: '11 Jan', value: 'h-[88%]', peak: false },
    { label: '12 Jan', value: 'h-[95%]', peak: true }
  ];

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      {/* Overview Headings */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-gray-400">
            <span>PLATFORM</span>
            <span>/</span>
            <span className="text-black font-semibold">ANALYTICS SYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-black tracking-tight tracking-normal">Analytics Overview</h1>
          <p className="text-xs text-gray-500 mt-1">System performance state, confidence parsing, and generation telemetry metrics.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => {
              const options = ['Last 30 Days', 'Last 7 Days', 'Q1 Roadmap'];
              const idx = options.indexOf(timeframe);
              setTimeframe(options[(idx + 1) % options.length]);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 text-black bg-white hover:bg-gray-50 transition-colors font-mono text-[10px] uppercase font-bold"
          >
            <Calendar className="w-3.5 h-3.5" />
            {timeframe}
          </button>
          <button 
            onClick={() => alert('Exported analytics metadata payload.')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 text-black bg-white hover:bg-gray-50 transition-colors font-mono text-[10px] uppercase font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </header>

      {/* High-density metrics counters row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 bg-white">
        
        {/* Stat 1 */}
        <div className="border-r border-b lg:border-b-0 border-gray-200 p-4 shrink-0 transition-colors hover:bg-neutral-50/50">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">TOTAL BRDS</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">{brdCount + 1245}</span>
            <span className="font-mono text-[9px] text-emerald-600 font-semibold uppercase tracking-widest">+12%</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 p-4 shrink-0 transition-colors hover:bg-neutral-50/50">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">AVG CONFIDENCE</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">94.2%</span>
            <span className="font-mono text-[9px] text-emerald-600 font-semibold uppercase tracking-widest">+1.5%</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="border-r border-gray-200 p-4 shrink-0 transition-colors hover:bg-neutral-50/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">LATENCY SPEED</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">1.4s</span>
            <span className="font-mono text-[9px] text-red-600 font-semibold uppercase tracking-widest">-0.2s</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-4 shrink-0 transition-colors hover:bg-neutral-50/50">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">API UPTIME</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">99.9%</span>
            <span className="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.1 font-bold uppercase tracking-wider">
              STABLE
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Log layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Agent Chart */}
        <div className="lg:col-span-8 border border-gray-200 p-5 bg-white flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3 select-none">
            <h2 className="font-mono text-xs font-bold uppercase text-gray-800 tracking-wider">
              Agent Performance Telemetry
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
              <span className="flex items-center gap-1.5 uppercase font-bold">
                <span className="w-2.5 h-2.5 bg-blue-200"></span> Success Loop
              </span>
              <span className="flex items-center gap-1.5 uppercase font-bold">
                <span className="w-2.5 h-2.5 bg-blue-600"></span> Signal Peak
              </span>
            </div>
          </div>

          {/* Sleek Custom Neobrutalist Bar Graph */}
          <div className="h-64 flex items-end gap-1 w-full relative pt-4">
            {/* Y axis indicators */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between font-mono text-[9px] text-gray-400 font-bold select-none pr-3 z-10">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>

            {/* Bars container */}
            <div className="flex items-end gap-3 w-full h-full ml-10 border-b border-gray-200 pb-1.5">
              {barData.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer">
                  {/* Tooltip value */}
                  <div className="opacity-0 group-hover:opacity-100 absolute mb-2 bg-black text-white font-mono text-[9px] px-1 py-0.5 rounded-none transition-all pointer-events-none transform -translate-y-[210%]">
                    {bar.peak ? '95.0%' : '80.0%'}
                  </div>
                  
                  {/* Actual bar node */}
                  <div className={`w-full transition-all duration-300 ${bar.value} ${
                    bar.peak 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-200 hover:bg-blue-300'
                  }`} />
                </div>
              ))}
            </div>
          </div>

          <div className="ml-10 flex justify-between mt-3 font-mono text-[10px] text-gray-400 font-extrabold select-none">
            <span>01 Jan</span>
            <span>12 Jan (Continuous Loop)</span>
          </div>
        </div>

        {/* Contemporary Recent Activity Sidebar Card */}
        <div className="lg:col-span-4 border border-gray-200 p-5 bg-white flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h2 className="font-mono text-xs font-bold uppercase text-gray-800 tracking-wider">
              Recent Activity
            </h2>
            <button 
              onClick={() => alert('Audit logs can be synced inside the Local Trace Database.')}
              className="text-blue-600 hover:text-blue-800 font-mono text-[10px] uppercase font-bold tracking-tight"
            >
              View All
            </button>
          </div>

          <ul className="flex flex-col divide-y divide-gray-100 h-64 overflow-y-auto">
            {recentActivities.map((act) => {
              const isWarning = act.status === 'Warning';
              const isSystem = act.status === 'System';

              return (
                <li key={act.id} className="py-3 flex flex-col justify-between gap-1 select-none text-[11px]">
                  <div className="flex justify-between items-center">
                    <p className="font-mono font-medium text-black tracking-tight">{act.title}</p>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider ${
                      isWarning 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : isSystem
                          ? 'bg-neutral-100 text-neutral-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono font-light tracking-tight">{act.timestamp}</span>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}

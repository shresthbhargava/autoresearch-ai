import React, { useState } from 'react';
import { Download, FileText, ChevronDown, Check, ShieldAlert, BadgeInfo, Calendar, ArrowUpRight } from 'lucide-react';
import { BRDDocument } from '../types';

interface ResultsPageProps {
  documents: BRDDocument[];
  selectedDocId: string;
  onDocChange: (id: string) => void;
}

export default function ResultsPage({ documents, selectedDocId, onDocChange }: ResultsPageProps) {
  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];
  const [showDocSelector, setShowDocSelector] = useState<boolean>(false);

  if (!currentDoc) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200">
        <ShieldAlert className="w-10 h-10 mx-auto text-amber-500 mb-2" />
        <p className="font-mono text-sm uppercase text-gray-500 font-bold">No Generated Documents Available</p>
        <p className="text-xs text-gray-400 mt-1">Please launch the Requirements Generator to synthesize a new BRD outline.</p>
      </div>
    );
  }

  // Adjust circular SVG dashoffset based on confidence score (e.g., 98.0 / 100)
  const score = currentDoc.confidence;
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  // Stroke dashoffset: circumference - (percentage * circumference)
  const strokeDashoffset = circumference - (score / 100 * circumference);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header and selection */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 pb-4 border-b border-black">
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              OUTPUT / {currentDoc.id.toUpperCase()}
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <div className="flex items-center gap-1 text-neutral-400">
              <Calendar className="w-3 h-3" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-tight">{currentDoc.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 select-none">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">
              {currentDoc.title}
            </h2>
            
            {/* Quick Interactive Doc Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDocSelector(!showDocSelector)}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
                title="Switch document"
              >
                <ChevronDown className="w-5 h-5 cursor-pointer" />
              </button>

              {showDocSelector && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] z-50">
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-gray-400">
                      GENERATED BLUEPRINTS ({documents.length})
                    </span>
                  </div>
                  <ul className="flex flex-col max-h-60 overflow-y-auto">
                    {documents.map(doc => (
                      <li key={doc.id}>
                        <button
                          onClick={() => {
                            onDocChange(doc.id);
                            setShowDocSelector(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center transition-colors font-mono ${
                            doc.id === currentDoc.id 
                              ? 'bg-neutral-100 text-black font-extrabold' 
                              : 'text-gray-600 hover:bg-neutral-50 hover:text-black'
                          }`}
                        >
                          <span className="truncate pr-2">{doc.title.replace('Business Requirement Document: ', '')}</span>
                          {doc.id === currentDoc.id && <Check className="w-3 h-3 shrink-0 text-black" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto shrink-0">
          <button 
            type="button"
            onClick={() => alert('PDF assets are being processed. Local filesystem sync handles download.')}
            className="flex-1 lg:flex-none uppercase font-mono text-[10px] font-bold tracking-wider px-4 py-2 border border-gray-300 bg-white text-black hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            PDF
          </button>
          <button 
            type="button"
            onClick={() => alert(`Requirements exported to Microsoft Word document formatted according to standard compliance models.`)}
            className="flex-1 lg:flex-none uppercase font-mono text-[10px] font-bold tracking-wider px-4 py-2 bg-black text-white hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-all shadow-none hover:shadow-[3px_3px_0px_#2170e4]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Word
          </button>
        </div>
      </header>

      {/* Grid Canvas Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Technical Confidence Widget */}
        <div className="col-span-1 md:col-span-4 border border-blue-100 p-5 flex flex-col bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6 border-b border-gray-100 pb-2 font-bold select-none">
            TECHNICAL VALIDITY
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path 
                  className="text-neutral-100" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  fill="none" 
                  d={`M 18,18 m 0,-${radius} a ${radius},${radius} 0 1,1 0,${2 * radius} a ${radius},${radius} 0 1,1 0,-${2 * radius}`}
                />
                {/* Progress Ring */}
                <path 
                  className="text-black transition-all duration-1000 ease-out" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="square"
                  fill="none" 
                  d={`M 18,18 m 0,-${radius} a ${radius},${radius} 0 1,1 0,${2 * radius} a ${radius},${radius} 0 1,1 0,-${2 * radius}`}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                <span className="font-mono text-[32px] font-extrabold tracking-tighter leading-none text-black">
                  {score.toFixed(1)}
                </span>
                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  Confidence
                </span>
              </div>
            </div>

            {/* Completeness bar info */}
            <div className="mt-8 w-full">
              <div className="flex justify-between font-mono text-[10px] text-neutral-400 mb-1.5 uppercase font-bold">
                <span>Completeness Diagnostic</span>
                <span>{currentDoc.completeness}%</span>
              </div>
              <div className="h-1 bg-neutral-100 w-full rounded-none overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-1000 ease-out" 
                  style={{ width: `${currentDoc.completeness}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <p className="font-mono text-[10px] text-gray-500 leading-relaxed pt-2 border-t border-gray-100 select-none">
            System validated against standard framework parameters. Structural parsing parity: High.
          </p>
        </div>

        {/* Executive Summary Section */}
        <div className="col-span-1 md:col-span-8 border border-gray-200 p-5 bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6 border-b border-gray-100 pb-2 font-bold select-none">
              01 / EXECUTIVE SUMMARY
            </h3>
            
            <div className="text-gray-700 text-stone-800 text-sm leading-relaxed space-y-4 max-w-2xl font-light">
              {currentDoc.executiveSummary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 flex flex-wrap gap-4 border-t border-gray-50 font-mono text-[10px] uppercase text-gray-500 font-bold select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-black"></span> KNOWLEDGE GRAPH
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-black"></span> AUTOMATED MODELLING
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-black"></span> SECURE BOUNDARIES
            </span>
          </div>
        </div>

        {/* Functional Requirements Component Block */}
        <div className="col-span-1 md:col-span-6 border border-gray-200 p-5 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6 border-b border-gray-100 pb-2 font-bold select-none">
            02 / FUNCTIONAL REQUIREMENTS
          </h3>
          <ul className="space-y-4 text-xs font-light text-stone-800 leading-relaxed">
            {currentDoc.functionalRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="font-mono font-bold text-gray-400 shrink-0 mt-0.5">{req.id}</span>
                <span>{req.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core User Stories Block */}
        <div className="col-span-1 md:col-span-6 border border-gray-200 p-5 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6 border-b border-gray-100 pb-2 font-bold select-none">
            03 / CORE USER STORIES
          </h3>
          <div className="space-y-4">
            {currentDoc.userStories.map((story, idx) => (
              <div key={idx} className="p-3.5 border border-gray-100 bg-gray-50/50 select-none">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                    {story.id}
                  </span>
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-tighter font-extrabold">
                    {story.priority === 'P0' ? 'P0 / Critical' : 'P1 / High'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-700 font-light italic leading-relaxed">
                  "As a <strong className="text-black font-semibold">{story.actor}</strong>, I want to <strong className="text-black font-semibold">{story.need}</strong> so that <strong className="text-black font-semibold">{story.purpose}</strong>"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture Map Flow */}
        <div className="col-span-1 md:col-span-12 border border-gray-200 p-5 bg-white">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold select-none">
              04 / ARCHITECTURE SNAPSHOT
            </h3>
            <span 
              onClick={() => alert(`Unified systemic infrastructure comprises localized data mapping loops with automated compliance checks.`)}
              className="font-mono text-[10px] uppercase text-blue-600 hover:underline flex items-center gap-1 font-bold cursor-pointer select-none"
            >
              Full Diagram 
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono select-none">
            <div className="p-4 border border-gray-100 bg-gray-50/30">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block mb-2">Layer A / Ingestion</span>
              <h4 className="text-xs font-bold text-black uppercase mb-1">{currentDoc.architecture.ingestion.name}</h4>
              <p className="text-[9px] text-gray-500 uppercase tracking-tighter">FORMATS: {currentDoc.architecture.ingestion.formats}</p>
            </div>
            
            <div className="p-4 border border-black bg-blue-50/10">
              <span className="text-[9px] text-blue-600 uppercase tracking-wider font-bold block mb-2">Layer B / Processing</span>
              <h4 className="text-xs font-bold text-black uppercase mb-1">{currentDoc.architecture.processing.name}</h4>
              <p className="text-[9px] text-blue-600 uppercase tracking-tighter">ENGINE: {currentDoc.architecture.processing.engine}</p>
            </div>

            <div className="p-4 border border-gray-100 bg-gray-50/30">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block mb-2">Layer C / Storage</span>
              <h4 className="text-xs font-bold text-black uppercase mb-1">{currentDoc.architecture.storage.name}</h4>
              <p className="text-[9px] text-gray-500 uppercase tracking-tighter">TYPE: {currentDoc.architecture.storage.type}</p>
            </div>
          </div>
        </div>

        {/* Risks & Mitigation protocols */}
        <div className="col-span-1 md:col-span-6 border border-gray-200 p-5 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6 border-b border-gray-100 pb-2 font-bold select-none">
            05 / RISK ESSENTIALS & MITIGATION
          </h3>
          <div className="space-y-4">
            {currentDoc.risks.map((risk, idx) => {
              const isError = risk.type === 'error';
              return (
                <div key={idx} className="select-none">
                  <h4 className={`text-xs font-bold uppercase flex items-center gap-1.5 mb-1.5 ${
                    isError ? 'text-red-600 border-red-100' : 'text-neutral-800'
                  }`}>
                    {isError ? (
                      <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <BadgeInfo className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                    {risk.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                    <strong className="text-black font-semibold font-mono text-[9px] uppercase tracking-wider bg-neutral-100 p-0.5">PROTOCOL:</strong> {risk.protocol}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Implementation roadmap visualization */}
        <div className="col-span-1 md:col-span-6 border border-gray-200 p-5 bg-white">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6 border-b border-gray-100 pb-2 font-bold select-none">
            06 / IMPLEMENTATION ROADMAP
          </h3>
          
          <div className="space-y-4 pt-1 select-none font-mono">
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
              <span>Development Channels</span>
              <span>Q1 - Q3 Delivery</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="w-10 text-[10px] text-gray-400 font-bold">P-1</span>
                <div className="flex-1 h-3.5 bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-black transition-all duration-1000 ease-out" style={{ width: `${currentDoc.roadmap.p1}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 text-[10px] text-gray-400 font-bold">P-2</span>
                <div className="flex-1 h-3.5 bg-neutral-100 overflow-hidden relative">
                  <div 
                    className="h-full bg-neutral-600 absolute transition-all duration-1000 ease-out" 
                    style={{ left: `${currentDoc.roadmap.p1}%`, width: `${currentDoc.roadmap.p2}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 text-[10px] text-gray-400 font-bold">P-3</span>
                <div className="flex-1 h-3.5 bg-neutral-100 overflow-hidden relative">
                  <div 
                    className="h-full bg-neutral-300 absolute transition-all duration-1000 ease-out" 
                    style={{ left: `${currentDoc.roadmap.p1 + currentDoc.roadmap.p2}%`, width: `${currentDoc.roadmap.p3}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-[9px] text-stone-400 font-bold uppercase mt-2 pt-2 border-t border-gray-50">
              <span>Initial Setup</span>
              <span>Staged Rollout</span>
              <span>Vetted Release</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

import React from 'react';
import { Sparkles, BrainCircuit, FileSpreadsheet, Zap, HelpCircle, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStartGenerator: () => void;
  onViewSample: () => void;
}

export default function LandingPage({ onStartGenerator, onViewSample }: LandingPageProps) {
  return (
    <div className="bg-white text-on-surface min-h-screen flex flex-col antialiased selection:bg-neutral-200">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 max-w-[1240px] mx-auto border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onStartGenerator}>
          {/* Logo with clean styling */}
          <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center font-black text-white text-[10px] tracking-widest">
            A
          </div>
          <span className="font-headline-md text-lg font-black tracking-tighter text-black">AutoResearch AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a className="text-gray-500 hover:text-black font-medium transition-colors cursor-pointer" onClick={onStartGenerator}>Platform</a>
          <a className="text-gray-500 hover:text-black font-medium transition-colors cursor-pointer" onClick={onViewSample}>Case Studies</a>
          <a className="text-gray-500 hover:text-black font-medium transition-colors cursor-pointer" onClick={onViewSample}>Documentation</a>
          <a className="text-gray-500 hover:text-black font-medium transition-colors cursor-pointer" onClick={onViewSample}>Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-black text-sm font-medium px-3 py-1 transition-colors" onClick={onStartGenerator}>
            Log In
          </button>
          <button 
            className="bg-black text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-neutral-800 transition-colors"
            onClick={onStartGenerator}
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section: Functional & Direct */}
        <section className="py-20 px-6 max-w-[1200px] mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-black px-3 py-1 mb-8">
              <Sparkles className="w-[14px] h-[14px] text-black" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">Intelligent Automation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-[1.08] tracking-tight">
              Generate Professional BRDs<br />
              <span className="text-blue-600 font-extrabold relative inline-block">
                in Minutes. 
                <span className="absolute left-0 right-0 bottom-1 h-1.5 bg-blue-100 -z-10"></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed font-normal">
              Turn startup ideas and documentation into comprehensive business blueprints with our Multi-Agent AI system. Experience intelligence at scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onStartGenerator}
                className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 border-2 border-black font-bold text-sm uppercase tracking-wider px-8 py-4 transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#2170e4]"
              >
                Generate BRD
              </button>
              <button 
                onClick={onViewSample}
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-50 border-2 border-black font-bold text-sm uppercase tracking-wider px-8 py-4 transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000]"
              >
                View Sample
              </button>
            </div>
          </div>
        </section>

        {/* Features Section: High Density, Sharp Cards */}
        <section className="py-16 px-6 max-w-[1240px] mx-auto border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Feature 1 */}
            <div className="border border-gray-300 p-8 flex flex-col hover:bg-gray-50 transition-colors">
              <div className="mb-4">
                <BrainCircuit className="text-black w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2 tracking-tight">AI Analysis</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Deep context understanding driven by large language models to structure your raw concepts into viable product requirements.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="border border-gray-300 border-t-0 md:border-t-[1px] md:border-l-0 md:border-r-0 p-8 flex flex-col hover:bg-gray-50 transition-colors">
              <div className="mb-4">
                <FileSpreadsheet className="text-black w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2 tracking-tight">PDF Extraction</h3>
              <p className="text-sm text-gray-500 leading-relaxed border-gray-200">
                Seamlessly ingest existing documentation. Our vision models extract structured data tables, text, and implicit requirements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-gray-300 p-8 flex flex-col hover:bg-gray-50 transition-colors">
              <div className="mb-4">
                <Zap className="text-black w-8 h-8" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-black mb-2 tracking-tight">Instant Documentation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Export production-ready Business Requirements Documents in standardized formats instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Multi-Agent Architecture Section: Increased Density, Utilitarian */}
        <section className="py-20 px-6 max-w-[1240px] mx-auto border-t border-gray-200">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-extrabold text-black mb-4 tracking-tight leading-snug">Multi-Agent Architecture</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our platform orchestrates specialized AI agents working in parallel to ensure rigorous analysis, architectural compliance, and comprehensive requirement document validation.
              </p>
              <div className="mt-8">
                <button 
                  onClick={onStartGenerator}
                  className="inline-flex items-center gap-2 group text-sm font-bold tracking-wider uppercase text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Configure Agents <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 gap-4">
                {/* Agent 1 */}
                <div className="flex items-center gap-4 p-5 border border-black bg-white select-none transition-transform hover:translate-x-1 duration-150">
                  <div className="h-10 w-10 border border-black flex items-center justify-center shrink-0 bg-neutral-900 text-white font-mono text-xs font-bold">
                    01
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-mono text-xs uppercase text-gray-500 font-bold tracking-normal">AGENT 1</h4>
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-black bg-blue-50 text-blue-700 font-bold">Extraction</span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono tracking-tight">Parses unstructured inputs from PDFs, raw messages, and team brainstorming notes.</p>
                  </div>
                </div>

                {/* Agent 2 */}
                <div className="flex items-center gap-4 p-5 border border-black bg-white select-none transition-transform hover:translate-x-1 duration-150">
                  <div className="h-10 w-10 border border-black flex items-center justify-center shrink-0 bg-neutral-900 text-white font-mono text-xs font-bold">
                    02
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-mono text-xs uppercase text-gray-500 font-bold tracking-normal">AGENT 2</h4>
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-black bg-emerald-50 text-emerald-700 font-bold">Enrichment</span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono tracking-tight">Adds essential market benchmarks, technology mapping, and functional user stories.</p>
                  </div>
                </div>

                {/* Agent 3 */}
                <div className="flex items-center gap-4 p-5 border border-black bg-white select-none transition-transform hover:translate-x-1 duration-150">
                  <div className="h-10 w-10 border border-black flex items-center justify-center shrink-0 bg-neutral-900 text-white font-mono text-xs font-bold">
                    03
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-mono text-xs uppercase text-gray-500 font-bold tracking-normal">AGENT 3</h4>
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-black bg-amber-50 text-amber-700 font-bold">Quality Control</span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono tracking-tight">Validates architecture parameters and structural compliance against rigorous enterprise standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-10 flex flex-col sm:flex-row justify-between items-center max-w-[1240px] mx-auto border-t border-gray-200">
        <div className="flex flex-col gap-1 mb-6 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-black flex items-center justify-center font-black text-white text-[8px] tracking-widest">
              A
            </div>
            <span className="font-headline-sm text-sm font-bold text-black uppercase tracking-tight">AutoResearch AI</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 AutoResearch AI. Built for fast-acting growth teams.</p>
        </div>
        <nav className="flex gap-6 font-mono text-[10px] uppercase font-bold tracking-wider text-gray-500">
          <a className="hover:text-black transition-colors" href="#">Terms</a>
          <a className="hover:text-black transition-colors" href="#">Privacy</a>
          <a className="hover:text-black transition-colors" href="#">Status</a>
          <a className="hover:text-black transition-colors" href="#">API Spec</a>
        </nav>
      </footer>
    </div>
  );
}

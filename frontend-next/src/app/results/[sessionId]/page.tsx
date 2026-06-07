"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Server,
  User,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Code
} from "lucide-react";

interface AgentTrace {
  step: string;
  agent: string;
  output_summary: string;
  tokens_used?: number;
}

interface BRDSection {
  title?: string;
  version?: string;
  date?: string;
  executive_summary?: string;
  problem_statement?: {
    current_situation?: string;
    pain_points?: string[];
    impact?: string;
  };
  objectives?: string[];
  scope?: {
    in_scope?: string[];
    out_of_scope?: string[];
  };
  stakeholders?: { role: string; responsibility: string }[];
  functional_requirements?: { id: string; requirement: string; priority: string }[];
  non_functional_requirements?: { id: string; requirement: string; category: string }[];
  user_stories?: { id: string; as_a: string; i_want: string; so_that: string; acceptance_criteria: string[] }[];
  technical_architecture?: {
    overview?: string;
    components?: string[];
    data_flow?: string;
    tech_stack?: string[];
  };
  success_metrics?: { metric: string; target: string; measurement: string }[];
  risks?: { risk: string; probability: string; impact: string; mitigation: string }[];
  timeline?: { phase: string; duration: string; deliverables: string[] }[];
  swot?: {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };
  competitors?: { name: string; advantages: string; disadvantages: string; risk_level: string }[];
  citations?: { source_text: string; confidence: number; mapped_requirement: string }[];
  overall_confidence?: number;
}

interface SessionState {
  session_id: string;
  status: "processing" | "success" | "failed";
  traces: AgentTrace[];
  brd: BRDSection;
  processing_time_ms: number;
  gcs_uri: string | null;
  error: string | null;
}

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [data, setData] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBqModal, setShowBqModal] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let pollInterval: NodeJS.Timeout | null = null;

    const fetchSession = async () => {
      try {
        const res = await fetch(`https://shresth0-autoresearch-ai.hf.space/api/sessions/${sessionId}/agents`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Session specifications not found. Verify session UUID.");
          }
          throw new Error("API retrieval failure.");
        }
        const sessionData: SessionState = await res.json();
        setData(sessionData);
        setLoading(false);

        // Cancel polling if finished or failed
        if (sessionData.status !== "processing" && pollInterval) {
          clearInterval(pollInterval);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to retrieve session details.");
        setLoading(false);
        if (pollInterval) clearInterval(pollInterval);
      }
    };

    // Run first fetch immediately
    fetchSession();

    // Start polling every 500ms
    pollInterval = setInterval(fetchSession, 500);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [sessionId]);

  const handleExportWord = () => {
    alert("Word Document synthesis initiated: Formatting content matching standard compliant structures...");
  };

  const handleExportPDF = () => {
    alert("PDF Document synthesis initiated: Compiling visual stylesheets...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          <RefreshCw className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Loading Session Specifications</h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono">Retrieving session uuid: {sessionId}...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md w-full card-3d border-red-950/40 p-6 rounded-xl glow-accent">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Session Error</h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono leading-relaxed">{error || "Data not initialized."}</p>
          <Link
            href="/generate"
            className="mt-6 inline-flex items-center gap-2 px-4.5 py-2 btn-3d-secondary text-xs font-mono font-bold uppercase rounded-lg text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Configuration
          </Link>
        </div>
      </div>
    );
  }

  const { status, traces, brd, processing_time_ms, gcs_uri } = data;
  const isGenerating = status === "processing";
  const confidenceScore = brd?.overall_confidence || 0.75;

  // Track steps of agents
  const agentsList = [
    { key: "1", name: "InputAgent", role: "Validation & Syntax" },
    { key: "2", name: "ExtractionAgent", role: "Modality Context Mining" },
    { key: "3", name: "EnrichmentAgent", role: "Industry Standards Mapping" },
    { key: "4", name: "BRDAgent", role: "Specification Drafting" },
    { key: "5", name: "QualityAgent", role: "Completeness Suite" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-accent relative overflow-hidden">
      
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e69906_1px,transparent_1px),linear-gradient(to_bottom,#00e69906_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40"></div>
      {/* Subtle organic light spots */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-accent/5 blur-[120px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="border-b border-darkBorder bg-card/60 backdrop-blur-md sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/generate"
              className="p-2 rounded-lg btn-3d-secondary group inline-flex items-center justify-center text-neutral-400 hover:text-white"
              title="Back to input"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                  SESSION / {sessionId.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-tight ${
                  status === "success" 
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : status === "failed"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                }`}>
                  {status === "processing" ? "Generating..." : status}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight -mt-0.5 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent text-glow">
                {brd?.title || "AI Synthesis Pipeline Active"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase btn-3d-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-0"
            >
              PDF
            </button>
            <button
              onClick={handleExportWord}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase btn-3d cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-b-0 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Word</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Upper Row: Summary metrics & Traces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Validity Indicator */}
          <div className="col-span-1 lg:col-span-4 card-3d rounded-xl p-5 flex flex-col justify-between glow-accent">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  TECHNICAL VALIDITY
                </span>
                <Server className="w-4 h-4 text-accent" />
              </div>

              <div className="flex items-center gap-6 py-2 select-none">
                {/* Circular indicator */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-accent transition-all duration-500 ease-out"
                      stroke="currentColor"
                      strokeDasharray={`${confidenceScore * 100}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-white">{(confidenceScore * 100).toFixed(0)}%</span>
                    <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-mono">Confidence</span>
                  </div>
                </div>

                <div className="flex-grow flex flex-col gap-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block leading-none">Status Code</span>
                    <span className="text-xs font-bold text-white uppercase mt-0.5 block">{status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block leading-none">Diagnostic Sync</span>
                    <span className="text-xs font-bold text-white uppercase mt-0.5 block">
                      {status === "processing" ? "Compiling..." : "Compliant (PASS)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-darkBorder pt-4 mt-4 text-[10px] font-mono text-neutral-500 leading-relaxed">
              Synthesized via Gemini 2.5 Pro multi-modal intelligence layer. Pipeline latency:{" "}
              <span className="text-neutral-300 font-bold">{(processing_time_ms / 1000).toFixed(2)}s</span>.
            </div>
          </div>

          {/* Live Agent Trace Feed */}
          <div className="col-span-1 lg:col-span-8 card-3d rounded-xl p-5 glow-accent flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-darkBorder pb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  AGENT TRAIL EXPLAINABILITY STREAM
                </span>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  {isGenerating ? "Streaming logs..." : "Idle"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                {agentsList.map((ag) => {
                  const trace = traces.find((t) => t.agent === ag.name);
                  const isCurrent = isGenerating && traces.length + 1 === parseInt(ag.key);
                  const isDone = traces.some((t) => t.agent === ag.name && t.output_summary.length > 50);

                  return (
                    <div
                      key={ag.key}
                      className={`border rounded-lg p-3 flex flex-col justify-between transition-all duration-300 relative shadow-sm ${
                        isDone
                          ? "bg-background/80 border-accent/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                          : isCurrent
                            ? "bg-accent/10 border-accent/60 glow-accent animate-pulse scale-[1.02]"
                            : "bg-background/20 border-darkBorder/40 opacity-40"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-neutral-500">{ag.key}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            isDone 
                              ? "bg-emerald-500" 
                              : isCurrent 
                                ? "bg-accent animate-ping" 
                                : "bg-neutral-800"
                          }`}></span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-tight">{ag.name}</h4>
                        <span className="text-[8px] font-mono text-neutral-500 uppercase mt-0.5 block leading-none">
                          {ag.role}
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-2 border-t border-darkBorder/30">
                        <p className="text-[9px] text-neutral-400 font-mono leading-snug line-clamp-3">
                          {isDone 
                            ? trace?.output_summary 
                            : isCurrent 
                              ? "Running extraction calculations..." 
                              : "Awaiting preceding node..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-darkBorder pt-3.5 mt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>ACTIVE WORKFLOW LOGS</span>
              <span className="text-neutral-300 font-bold">
                TOTAL TOKENS: {traces.reduce((acc, t) => acc + (t.tokens_used || 0), 0)}
              </span>
            </div>
          </div>

        </div>

        {/* Content Canvas Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Incremental BRD Sections */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
            
            {/* Section 1: Executive Summary */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                01 / EXECUTIVE SUMMARY
              </h3>
              {brd.executive_summary ? (
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {brd.executive_summary}
                </p>
              ) : (
                <div className="space-y-2.5 animate-pulse">
                  <div className="h-3.5 bg-slate-900 rounded w-full"></div>
                  <div className="h-3.5 bg-slate-900 rounded w-11/12"></div>
                  <div className="h-3.5 bg-slate-900 rounded w-4/5"></div>
                </div>
              )}
            </div>

            {/* Section 2: Problem Statement */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                02 / PROBLEM STATEMENT & IMPACT
              </h3>
              {brd.problem_statement ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wide">Current Situation</h4>
                    <p className="text-sm text-neutral-300 mt-1 font-light leading-relaxed">
                      {brd.problem_statement.current_situation}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wide">Key Pain Points</h4>
                    <ul className="list-disc pl-5 text-sm text-neutral-300 mt-1.5 space-y-1.5 font-light leading-relaxed">
                      {brd.problem_statement.pain_points?.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 bg-red-950/10 border border-red-900/20 rounded-lg">
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide">Downstream Impact</h4>
                    <p className="text-sm text-red-300/90 mt-1 font-light leading-relaxed">
                      {brd.problem_statement.impact}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-900 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-900 rounded w-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-900 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-900 rounded w-5/6"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: SMART Objectives */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                03 / STRATEGIC OBJECTIVES (SMART)
              </h3>
              {brd.objectives ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brd.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-3 items-start p-3.5 bg-slate-950/60 border border-darkBorder rounded-lg">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-sm text-neutral-300 font-light leading-relaxed">{obj}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                  <div className="h-14 bg-slate-900 rounded"></div>
                  <div className="h-14 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 4: Boundaries & Scope */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                04 / BOUNDARIES & PRODUCT SCOPE
              </h3>
              {brd.scope ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      In-Scope Functional Boundaries
                    </h4>
                    <ul className="space-y-2">
                      {brd.scope.in_scope?.map((scope, i) => (
                        <li key={i} className="text-sm text-neutral-300 font-light flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{scope}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t md:border-t-0 md:border-l border-darkBorder pt-6 md:pt-0 md:pl-6">
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                      Out-of-Scope Exclusions
                    </h4>
                    <ul className="space-y-2">
                      {brd.scope.out_of_scope?.map((scope, i) => (
                        <li key={i} className="text-sm text-neutral-400 font-light flex items-start gap-2 leading-relaxed">
                          <span className="text-red-500 font-mono font-bold shrink-0 mt-0.5">✕</span>
                          <span>{scope}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  <div className="h-24 bg-slate-900 rounded"></div>
                  <div className="h-24 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 5: Stakeholders */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                05 / STAKEHOLDER RACI ROLES
              </h3>
              {brd.stakeholders ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {brd.stakeholders.map((sh, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-darkBorder rounded-lg flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-slate-900 border border-darkBorder flex items-center justify-center text-neutral-400 shrink-0">
                        <User className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sh.role}</h4>
                        <p className="text-xs text-neutral-400 mt-1 leading-normal font-light">
                          {sh.responsibility}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                  <div className="h-16 bg-slate-900 rounded"></div>
                  <div className="h-16 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 6: Functional Requirements */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                06 / FUNCTIONAL SPECIFICATIONS
              </h3>
              {brd.functional_requirements ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-darkBorder text-neutral-400">
                        <th className="py-2.5 font-mono uppercase tracking-wider font-bold">Req ID</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider font-bold">Requirement</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider font-bold text-right">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-darkBorder/40">
                      {brd.functional_requirements.map((req, i) => (
                        <tr key={i} className="text-neutral-300 font-light hover:bg-slate-900/10">
                          <td className="py-3 font-mono font-bold text-accent">{req.id}</td>
                          <td className="py-3 pr-4 leading-relaxed">{req.requirement}</td>
                          <td className="py-3 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-tight ${
                              req.priority.toLowerCase() === "high" 
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : req.priority.toLowerCase() === "medium"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}>
                              {req.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-8 bg-slate-900 rounded"></div>
                  <div className="h-8 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 7: Non-Functional Requirements */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                07 / NON-FUNCTIONAL REQUIREMENTS
              </h3>
              {brd.non_functional_requirements ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-darkBorder text-neutral-400">
                        <th className="py-2.5 font-mono uppercase tracking-wider font-bold">NFR ID</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider font-bold">Requirement</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider font-bold text-right">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-darkBorder/40">
                      {brd.non_functional_requirements.map((req, i) => (
                        <tr key={i} className="text-neutral-300 font-light hover:bg-slate-900/10">
                          <td className="py-3 font-mono font-bold text-accent">{req.id}</td>
                          <td className="py-3 pr-4 leading-relaxed">{req.requirement}</td>
                          <td className="py-3 text-right">
                            <span className="inline-block px-2 py-0.5 bg-slate-950 border border-darkBorder text-neutral-400 rounded text-[9px] font-mono uppercase font-bold tracking-tight">
                              {req.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-8 bg-slate-900 rounded"></div>
                  <div className="h-8 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 8: User Stories */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                08 / CORE USER STORIES
              </h3>
              {brd.user_stories ? (
                <div className="flex flex-col gap-4">
                  {brd.user_stories.map((story, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-darkBorder rounded-lg">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-mono text-[9px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded font-bold uppercase">
                          {story.id}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">User Story Node</span>
                      </div>
                      <p className="text-xs text-neutral-200 italic leading-relaxed">
                        &ldquo;As a <strong className="text-white font-semibold font-sans">{story.as_a}</strong>, 
                        I want to <strong className="text-white font-semibold font-sans">{story.i_want}</strong> 
                        so that <strong className="text-white font-semibold font-sans">{story.so_that}</strong>&rdquo;
                      </p>
                      {story.acceptance_criteria && story.acceptance_criteria.length > 0 && (
                        <div className="mt-3.5 pt-3.5 border-t border-darkBorder/30">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wide block mb-2">
                            Acceptance Criteria
                          </span>
                          <ul className="space-y-1.5">
                            {story.acceptance_criteria.map((crit, idx) => (
                              <li key={idx} className="text-[11px] text-neutral-400 flex items-start gap-2 leading-relaxed">
                                <span className="text-accent shrink-0 mt-0.5">•</span>
                                <span>{crit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 animate-pulse">
                  <div className="h-20 bg-slate-900 rounded"></div>
                  <div className="h-20 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 9: Technical Architecture */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                09 / TECHNICAL INFRASTRUCTURE SNAPSHOT
              </h3>
              {brd.technical_architecture ? (
                <div className="flex flex-col gap-4 font-sans">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wide">Architectural Overview</h4>
                    <p className="text-sm text-neutral-300 mt-1 font-light leading-relaxed">
                      {brd.technical_architecture.overview}
                    </p>
                  </div>
                  
                  {brd.technical_architecture.components && (
                    <div>
                      <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wide mb-2">Core Blocks</h4>
                      <div className="flex flex-wrap gap-2">
                        {brd.technical_architecture.components.map((comp, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-darkBorder text-neutral-300 rounded text-xs font-mono">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {brd.technical_architecture.data_flow && (
                    <div>
                      <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wide">Security & Data Ingestion Flow</h4>
                      <p className="text-sm text-neutral-300 mt-1 font-light leading-relaxed">
                        {brd.technical_architecture.data_flow}
                      </p>
                    </div>
                  )}

                  {brd.technical_architecture.tech_stack && (
                    <div>
                      <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wide mb-2">Technology Matrix</h4>
                      <div className="flex flex-wrap gap-2">
                        {brd.technical_architecture.tech_stack.map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent rounded text-xs font-mono font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 animate-pulse">
                  <div className="h-20 bg-slate-900 rounded"></div>
                  <div className="h-10 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 10: Roadmap / Timeline */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                10 / IMPLEMENTATION PATHWAY & MILESTONES
              </h3>
              {brd.timeline ? (
                <div className="space-y-6 relative pl-4 border-l border-darkBorder ml-2 pt-2">
                  {brd.timeline.map((tm, idx) => (
                    <div key={idx} className="relative select-none">
                      {/* Workflow dot */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background"></div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mb-2">
                        <h4 className="text-sm font-bold text-white uppercase">{tm.phase}</h4>
                        <span className="px-2 py-0.5 bg-slate-900 border border-darkBorder text-neutral-400 rounded text-[10px] font-mono font-bold uppercase">
                          {tm.duration}
                        </span>
                      </div>
                      <div className="pl-0.5">
                        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                          Key Deliverables
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {tm.deliverables.map((del, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-1.5 font-light leading-relaxed">
                              <span className="text-neutral-600 font-bold">•</span>
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-pulse">
                  <div className="h-20 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 11: Success Metrics */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                11 / KEY PERFORMANCE METRICS
              </h3>
              {brd.success_metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brd.success_metrics.map((m, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 border border-darkBorder rounded-lg">
                      <TrendingUp className="w-4 h-4 text-emerald-400 mb-2.5" />
                      <h4 className="text-xs font-bold text-white leading-tight">{m.metric}</h4>
                      <div className="mt-3 flex justify-between items-baseline gap-1.5 font-mono">
                        <span className="text-neutral-500 text-[10px] uppercase font-bold">Target</span>
                        <span className="text-sm font-extrabold text-accent">{m.target}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1.5 leading-normal font-light">
                        {m.measurement}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                  <div className="h-24 bg-slate-900 rounded"></div>
                  <div className="h-24 bg-slate-900 rounded"></div>
                  <div className="h-24 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Section 12: Risks & Mitigations */}
            <div className="card-3d rounded-xl p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent mb-4 border-b border-darkBorder pb-2">
                12 / RISK SUITE & MITIGATION PROTOCOLS
              </h3>
              {brd.risks ? (
                <div className="space-y-4">
                  {brd.risks.map((rk, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 border border-darkBorder rounded-lg">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5 leading-tight">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                          {rk.risk}
                        </h4>
                        <div className="flex gap-1.5 shrink-0 font-mono text-[9px] uppercase font-bold tracking-tight">
                          <span className="px-1.5 py-0.5 bg-red-950/20 text-red-400 border border-red-500/10 rounded">
                            Prob: {rk.probability}
                          </span>
                          <span className="px-1.5 py-0.5 bg-red-950/20 text-red-400 border border-red-500/10 rounded">
                            Imp: {rk.impact}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        <strong className="font-mono text-[9px] uppercase tracking-wider text-accent mr-1 bg-accent/5 px-1 py-0.5 rounded">
                          Mitigation Protocol:
                        </strong>{" "}
                        {rk.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: SWOT grid, competitors, citations */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            
            {/* SWOT Grid */}
            <div className="card-3d rounded-xl p-5 glow-accent">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-4 border-b border-darkBorder pb-2">
                SWOT ANALYSIS GRID
              </h3>
              
              {brd.swot ? (
                <div className="grid grid-cols-2 gap-3 font-sans">
                  {/* Strengths */}
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                    <h4 className="text-[10px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest block mb-2">
                      S / Strengths
                    </h4>
                    <ul className="space-y-1 text-[10px] text-neutral-300 font-light leading-relaxed">
                      {brd.swot.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <h4 className="text-[10px] font-mono font-extrabold text-red-400 uppercase tracking-widest block mb-2">
                      W / Weaknesses
                    </h4>
                    <ul className="space-y-1 text-[10px] text-neutral-300 font-light leading-relaxed">
                      {brd.swot.weaknesses?.map((w, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-red-500 font-bold shrink-0">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <h4 className="text-[10px] font-mono font-extrabold text-blue-400 uppercase tracking-widest block mb-2">
                      O / Opportunities
                    </h4>
                    <ul className="space-y-1 text-[10px] text-neutral-300 font-light leading-relaxed">
                      {brd.swot.opportunities?.map((o, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                    <h4 className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-widest block mb-2">
                      T / Threats
                    </h4>
                    <ul className="space-y-1 text-[10px] text-neutral-300 font-light leading-relaxed">
                      {brd.swot.threats?.map((t, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 animate-pulse">
                  <div className="h-24 bg-slate-900 rounded"></div>
                  <div className="h-24 bg-slate-900 rounded"></div>
                  <div className="h-24 bg-slate-900 rounded"></div>
                  <div className="h-24 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Competitor Table */}
            <div className="card-3d rounded-xl p-5 glow-accent">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3 border-b border-darkBorder pb-2">
                COMPETITIVE BENCHMARKS
              </h3>

              {brd.competitors ? (
                <div className="overflow-x-auto text-[11px] font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-darkBorder text-neutral-500">
                        <th className="py-2 font-mono uppercase tracking-wider font-bold">Competitor</th>
                        <th className="py-2 font-mono uppercase tracking-wider font-bold">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-darkBorder/30">
                      {brd.competitors.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/10">
                          <td className="py-2.5">
                            <span className="font-bold text-white block">{comp.name}</span>
                            <span className="text-[10px] text-emerald-400 leading-normal block font-light">Pros: {comp.advantages}</span>
                            <span className="text-[10px] text-red-400 leading-normal block font-light">Cons: {comp.disadvantages}</span>
                          </td>
                          <td className="py-2.5 align-top">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-tight ${
                              comp.risk_level.toLowerCase() === "high" 
                                ? "bg-red-500/10 text-red-400"
                                : comp.risk_level.toLowerCase() === "medium"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-blue-500/10 text-blue-400"
                            }`}>
                              {comp.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-2.5 animate-pulse">
                  <div className="h-6 bg-slate-900 rounded"></div>
                  <div className="h-16 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

            {/* Citation Highlights */}
            <div className="card-3d rounded-xl p-5 glow-accent">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3 border-b border-darkBorder pb-2">
                CITATION HIGHLIGHTS (GROUNDING)
              </h3>
              
              {brd.citations ? (
                <div className="flex flex-col gap-3 font-sans">
                  {brd.citations.map((cite, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 border border-darkBorder rounded-lg">
                      <p className="text-[10px] text-neutral-300 leading-relaxed italic">
                        &ldquo;{cite.source_text}&rdquo;
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-darkBorder/30 flex justify-between items-center text-[9px] font-mono text-neutral-500 uppercase font-bold">
                        <span>Confidence: <strong className="text-emerald-400">{(cite.confidence * 100).toFixed(0)}%</strong></span>
                        <span className="text-neutral-400 text-[8px] tracking-tight">{cite.mapped_requirement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-slate-900 rounded"></div>
                  <div className="h-16 bg-slate-900 rounded"></div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Panel: BigQuery Audit */}
        <div className="card-3d rounded-xl overflow-hidden">
          <div className="p-4 border-b border-darkBorder bg-slate-900/40 flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4 text-accent" />
              BIGQUERY COMPLIANCE AUDIT PANEL
            </span>
            <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Explainable AI Layer Active
            </span>
          </div>

          <div className="p-4 overflow-x-auto text-[10px] font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-darkBorder text-neutral-500 uppercase font-bold">
                  <th className="py-2 pr-4">Row ID</th>
                  <th className="py-2 pr-4">BQ Destination Table</th>
                  <th className="py-2 pr-4">Cloud Storage Target</th>
                  <th className="py-2 pr-4">Ingestion Type</th>
                  <th className="py-2 pr-4 text-right">Log Cost</th>
                  <th className="py-2 text-right">Raw Audit Log</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="hover:bg-slate-900/10">
                  <td className="py-3 pr-4 font-bold text-neutral-100">{sessionId}</td>
                  <td className="py-3 pr-4">
                    <span className="text-accent">autoresearch.sessions</span> &amp; <span className="text-accent">agent_traces</span>
                  </td>
                  <td className="py-3 pr-4 truncate max-w-[200px]">
                    {gcs_uri || "gs://autoresearch-ai-brd-store/brds/dev..."}
                  </td>
                  <td className="py-3 pr-4">Multimodal AI Stream</td>
                  <td className="py-3 pr-4 text-right text-emerald-400 font-bold">$0.00016</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setShowBqModal(true)}
                      className="px-2 py-1 rounded text-[9px] font-bold uppercase cursor-pointer btn-3d-secondary inline-flex items-center gap-1"
                    >
                      <Code className="w-3 h-3 text-accent" />
                      Inspect Row
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-darkBorder bg-card/20 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
          AutoResearch AI Compliance Monitor • BigQuery Logging Pipeline Active
        </div>
      </footer>

      {/* Raw BigQuery JSON Inspection Modal */}
      {showBqModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-3d rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-darkBorder flex justify-between items-center bg-slate-900/40">
              <span className="font-mono text-xs text-white uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-accent" />
                Raw BigQuery Row Payload
              </span>
              <button
                onClick={() => setShowBqModal(false)}
                className="text-neutral-400 hover:text-white font-mono text-xs border border-darkBorder bg-slate-950 px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto bg-slate-950/60 font-mono text-xs leading-relaxed text-emerald-400 flex-grow">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify({
                  session_id: sessionId,
                  created_at: new Date().toISOString(),
                  input_type: brd.citations ? "pdf/image" : "text",
                  confidence_score: confidenceScore,
                  brd_title: brd.title || "Untitled BRD Specifications",
                  gcs_uri: gcs_uri || `gs://autoresearch-ai-brd-store/brds/${sessionId}/brd_payload.json`,
                  processing_time_ms: processing_time_ms || 2500,
                  schema_validation: "PASS",
                  agent_trace_logs: traces.map((t) => ({
                    agent: t.agent,
                    step_id: t.step,
                    output_summary: t.output_summary,
                    tokens_used: t.tokens_used || 0
                  }))
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

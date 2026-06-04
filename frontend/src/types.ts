export interface BRDDocument {
  id: string;
  title: string;
  status: 'Success' | 'Warning' | 'System';
  timestamp: string;
  confidence: number;
  completeness: number;
  executiveSummary: string;
  functionalRequirements: {
    id: string;
    description: string;
  }[];
  userStories: {
    id: string;
    actor: string;
    need: string;
    purpose: string;
    priority: 'P0' | 'P1' | 'P2';
  }[];
  architecture: {
    ingestion: { name: string; formats: string };
    processing: { name: string; engine: string };
    storage: { name: string; type: string };
  };
  risks: {
    title: string;
    type: 'error' | 'warning' | 'info';
    protocol: string;
  }[];
  roadmap: {
    p1: number; // percentage
    p2: number;
    p3: number;
  };
}

export interface ActivityLog {
  id: string;
  title: string;
  status: 'Success' | 'Warning' | 'System';
  timestamp: string;
}

export interface AgentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed';
  message: string;
  timestamp?: string;
  progress?: number;
}

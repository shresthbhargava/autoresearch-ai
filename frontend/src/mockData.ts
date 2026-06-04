import { BRDDocument, ActivityLog } from './types';

export const mockBRDs: BRDDocument[] = [
  {
    id: 'brd-nexus',
    title: 'Business Requirement Document: Project Nexus',
    status: 'Success',
    timestamp: '2 mins ago',
    confidence: 98.0,
    completeness: 100,
    executiveSummary: 'Project Nexus aims to revolutionize internal data retrieval by implementing an AI-driven knowledge graph. This system will aggregate decentralized documentation across 14 enterprise silos into a unified, semantically searchable interface.\n\nThe primary objective is to reduce average search time by 40% for customer support agents, thereby increasing first-call resolution rates and improving overall customer satisfaction metrics.',
    functionalRequirements: [
      { id: '2.1', description: 'The system must ingest PDF, DOCX, and HTML formats via RESTful APIs.' },
      { id: '2.2', description: 'Natural language query processing with sub-second response times for typical queries.' },
      { id: '2.3', description: 'Role-Based Access Control (RBAC) to restrict document visibility based on user tier.' },
      { id: '2.4', description: 'Automated citation generation linking answers directly to source paragraphs.' }
    ],
    userStories: [
      { id: 'US-01', actor: 'Support Agent', need: 'ask questions in plain English', purpose: "I don't have to remember complex boolean search operators.", priority: 'P0' },
      { id: 'US-02', actor: 'Manager', need: 'see a dashboard of most frequent unresolved queries', purpose: 'identify documentation gaps.', priority: 'P1' }
    ],
    architecture: {
      ingestion: { name: 'Airflow Pipelines', formats: 'PDF, DOCX, HTML' },
      processing: { name: 'GPT-4 Inference', engine: 'LANGCHAIN / RAG' },
      storage: { name: 'Pinecone Vector', type: 'HNSW INDEXING' }
    },
    risks: [
      { title: 'Privacy Leakage', type: 'error', protocol: 'Implement strict RBAC at the vector level. Bi-weekly pen-testing cycles before production.' },
      { title: 'AI Hallucinations', type: 'info', protocol: 'Hard grounding in prompts. Citation of source chunks is mandatory for response generation.' }
    ],
    roadmap: {
      p1: 33,
      p2: 50,
      p3: 25
    }
  },
  {
    id: 'brd-fintech-q3',
    title: 'Business Requirement Document: Fintech PayGate Q3',
    status: 'Success',
    timestamp: '2 hours ago',
    confidence: 94.2,
    completeness: 88,
    executiveSummary: 'Fintech PayGate Q3 establishes an automated compliance and routing ledger to handle cross-border multi-currency client settlement. Operating on split-second routing paths, it lowers payment failure rates by 15% and ensures compliance with EU MiFID regulations.\n\nThe product integrates automated risk validation models directly with central core ledgers.',
    functionalRequirements: [
      { id: '2.1', description: 'Must support real-time tokenized SWIFT/SEPA transfers securely.' },
      { id: '2.2', description: 'Automated Sanctions Screening powered by pre-integrated API calls.' },
      { id: '2.3', description: 'Real-time liquidity pooling diagnostics with sub-second failover state registers.' }
    ],
    userStories: [
      { id: 'US-01', actor: 'Compliance Officer', need: 'receive alerts for high-risk flags', purpose: 'audit flagged cross-border transactions under 5 minutes.', priority: 'P0' },
      { id: 'US-02', actor: 'Finance Operator', need: 'visualize currency-specific float reserves', purpose: 'optimize treasury liquidity balancing manually when needed.', priority: 'P1' }
    ],
    architecture: {
      ingestion: { name: 'Kafka Multi-topic streams', formats: 'JSON, PROTOBUF' },
      processing: { name: 'Flink Compliance Workers', engine: 'REGE VAL / ML ROUTING' },
      storage: { name: 'Postgres Distributed', type: 'ACID COMPLIANT SHARDING' }
    },
    risks: [
      { title: 'Liquidity Latency Risk', type: 'error', protocol: 'Execute real-time ledger sync locks. Limit high-volume routing on unstable channels during peaks.' },
      { title: 'Sanctions Failures', type: 'warning', protocol: 'Establish dual backup screening services with instant fallback protocols.' }
    ],
    roadmap: {
      p1: 45,
      p2: 40,
      p3: 15
    }
  },
  {
    id: 'brd-healthcare-mvp',
    title: 'Business Requirement Document: HealthSync Core MVP',
    status: 'Warning',
    timestamp: '1 day ago',
    confidence: 91.5,
    completeness: 92,
    executiveSummary: 'HealthSync Core MVP provides HIPAA-compliant patient charting, scheduling, and diagnostic telemetry pipelines. It coordinates medical telemetry endpoints with local practitioners and handles direct FHIR profile mapping for universal EHR integrations.\n\nThe design guarantees secure medical credentialing and real-time vital streams storage.',
    functionalRequirements: [
      { id: '2.1', description: 'Map native patient records into strict FHIR JSON standards without schema loss.' },
      { id: '2.2', description: 'Secure client transport using TLS 1.3 tunnels and AES-256 local caches on device.' },
      { id: '2.3', description: 'Integration with diagnostic BLE diagnostic accessories for pulse-oximeter metrics.' }
    ],
    userStories: [
      { id: 'US-01', actor: 'Nurse', need: 'push vital logs from bedside monitors', purpose: 'update the electronic health chart automatically.', priority: 'P0' },
      { id: 'US-02', actor: 'Patient', need: 'grant secure record access to specialists via app PIN', purpose: 'avoid faxing sensitive medical release papers.', priority: 'P0' }
    ],
    architecture: {
      ingestion: { name: 'HL7 / FHIR Ingestion Gateway', formats: 'FHIR JSON, HL7 V2' },
      processing: { name: 'Encryption Proxy Proxy', engine: 'AES ENGINE / SYNCING' },
      storage: { name: 'Google Cloud Healthcare API', type: 'HIPAA COMPLIANT WORKSPACE' }
    },
    risks: [
      { title: 'Data Encryption In transit', type: 'error', protocol: 'Strict TLS enforcement. Deny legacy requests matching protocols older than TLS 1.2.' },
      { title: 'Hardware Interconnectivity', type: 'warning', protocol: 'Provide local offline queues on mobile apps to store BLE packets during network blackouts.' }
    ],
    roadmap: {
      p1: 60,
      p2: 30,
      p3: 10
    }
  }
];

export const mockRecentActivities: ActivityLog[] = [
  { id: '1', title: 'BRD_Fintech_Q3', status: 'Success', timestamp: '2 mins ago' },
  { id: '2', title: 'Trace Analysis', status: 'Warning', timestamp: '15 mins ago' },
  { id: '3', title: 'BRD_Healthcare_MVP', status: 'Success', timestamp: '1 hr ago' },
  { id: '4', title: 'Knowledge Sync', status: 'System', timestamp: '3 hrs ago' }
];

export const defaultPerformanceData = [
  { label: '01 Jan', count: 85 },
  { label: '02 Jan', count: 92 },
  { label: '03 Jan', count: 78 },
  { label: '04 Jan', count: 96, peak: true },
  { label: '05 Jan', count: 88 },
  { label: '06 Jan', count: 94 },
  { label: '07 Jan', count: 82 },
  { label: '08 Jan', count: 89 },
  { label: '09 Jan', count: 91 },
  { label: '10 Jan', count: 95, peak: true }
];
